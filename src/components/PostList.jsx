import { useState, useEffect } from 'react';
import NewPost from "./NewPost";
import Post from "./Post";
import classes from "./PostList.module.css";
import Modal from './Modal';

function PostList({ isPosting, onStopPosting }) {
    const [posts, setPosts] = useState([]);

    // Fetch and store data in localStorage when component mounts
    useEffect(() => {
        const storedData = localStorage.getItem('storedPosts');
        if (storedData) {
            setPosts(JSON.parse(storedData));
        } else {
            fetchDataAndStore();
        }
    }, []);

    // Fetch data from API and store in localStorage
    const fetchDataAndStore = () => {
        fetch('https://react-modal-data-default-rtdb.firebaseio.com/modals.json')
            .then(response => response.json())
            .then(data => {
                const modaldatas = [];
                for (const key in data) {
                    const modaldata = {
                        id: key,
                        ...data[key]
                    };
                    modaldatas.push(modaldata);
                }
                setPosts(modaldatas);
                localStorage.setItem('storedPosts', JSON.stringify(modaldatas));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };


    // Add post handler
    async function addPostHandler(postData) {
        try {
            const response = await fetch('https://react-modal-data-default-rtdb.firebaseio.com/modals.json', {
                method: 'POST',
                body: JSON.stringify(postData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json();
            const newPost = { ...postData, id: responseData.name };
            setPosts((existingPosts) => [newPost, ...existingPosts]);
            localStorage.setItem('storedPosts', JSON.stringify([newPost, ...posts]));
        } catch (error) {
            console.error('Error adding post:', error);
        }
    }
    return (
                <>
                    {isPosting && (
                        <Modal onClose={onStopPosting}>
                            <NewPost onCancel={onStopPosting} onAddPost={addPostHandler } />
                        </Modal>
                    )}
                    {posts.length > 0 && (
            <ul className={classes.posts}>
                {posts.map((post) => (
                    <Post key={post.id} author={post.author} body={post.body} />
                ))}
            </ul>
        )}
                    {posts.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'white' }}>
                            <h2>There are no posts yet.</h2>
                            <p>Start adding some!</p>
                        </div>
                    )}
        
                </>
            )

}

export default PostList;