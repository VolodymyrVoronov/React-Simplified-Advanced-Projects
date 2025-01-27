import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router"
import { getPost, updatePost } from "../api/posts"
import { getUsers } from "../api/users"
import { PostForm, postFormValidator } from "../components/PostForm"

function EditPost() {
  const { usersPromise, postPromise } = useLoaderData()
  const { state } = useNavigation()
  const errors = useActionData()
  const isSubmitting = state === "submitting"

  return (
    <>
      <h1 className="page-title">Edit Post</h1>
      <PostForm
        usersPromise={usersPromise}
        isSubmitting={isSubmitting}
        errors={errors}
        defaultValuesPromise={postPromise}
      />
    </>
  )
}

function loader({ request: { signal }, params: { postId } }) {
  const post = getPost(postId, { signal })
  const users = getUsers({ signal })

  return { postPromise: post, usersPromise: users }
}

async function action({ request, params: { postId } }) {
  const formData = await request.formData()
  const title = formData.get("title")
  const body = formData.get("body")
  const userId = formData.get("userId")

  const errors = postFormValidator({ title, userId, body })

  if (Object.keys(errors).length > 0) {
    return errors
  }

  const post = await updatePost(
    postId,
    { title, body, userId },
    { signal: request.signal }
  )

  return redirect(`/posts/${post.id}`)
}

export const editPostRoute = {
  loader,
  action,
  element: <EditPost />,
}
