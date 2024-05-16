import { Link } from 'react-router-dom';
import { List, FlexboxGrid } from 'rsuite';

function Posts({ blogPosts }) {
  return (
    <List>
      {blogPosts.map((post) => (
        <List.Item key={post.id}>
          <Link to={post.id.toString()} style={{ textDecoration: 'none', color: 'inherit'}}>
            <h3>{post.title}</h3>
          </Link>
        </List.Item>
      ))}
    </List>
  );
}

export default Posts;
