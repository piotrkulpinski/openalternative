import { Link } from "@remix-run/react"
import { allPosts } from "content-collections"

export default function BlogPage() {
  return (
    <ul>
      {allPosts.map(post => (
        <li key={post._meta.path}>
          <Link to={`/blog/${post._meta.path}`} unstable_viewTransition>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
