import { useState,useEffect } from 'react';
import NewPost from "./NewPost";
import Post from "./Post";
import classes from "./PostList.module.css";
import Modal from './Modal';

function PostList({ isPosting, onStopPosting }) {
    // const [isLoading, setIsLoading] = useState(true);
    // const [modals, setModal] = useState([]);
    
    // useEffect(() => {
    //     setIsLoading(true);
    //     fetch('https://react-modal-data-default-rtdb.firebaseio.com/modals.json').then(response => {
    //         return response.json();
    //     }).then(data => {
    //         const modaldatas = [];
    //         for (const key in data) {
    //             const modaldata = {
    //                 id: key,
    //                 ...data[key]
    //             };
    //             modaldatas.push(modaldata);
    //         }
    //         setIsLoading(false);
    //         setModal(data);
    //     });

        
    // }, []);
    // if (isLoading) {
    //     return (
    //         <div style={{ textAlign: 'center', color: 'white' }}>
    //             <p>Loading...</p>
    //         </div>
    //     )
    // }
    // useEffect(() => {
    //     async function fetchPosts() {
    //         const response = await fetch('https://react-modal-data-default-rtdb.firebaseio.com/modals.json')
    //         const resData = await response.json();
    //         setPosts(resData.modals);
    //     }
    //     fetchPosts();
    // }, []);

    const [posts, setPosts] = useState([]);

        useEffect(() => {
            fetch('https://react-modal-data-default-rtdb.firebaseio.com/modals.json')
            .then(response => response.json())
            .then((data) => {
                setPosts(data);
            });
        }, []);
    function addPostHandler(postData) {
        fetch('https://react-modal-data-default-rtdb.firebaseio.com/modals.json', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
            'Content-Type':'application/json'
            }
        })
        setPosts((existingPosts)=>[postData,...existingPosts]);
    }


    // let modalContent;
    // if (modalIsVisible) {
    //     modalContent = (
    //         <Modal onClose={hideModalHandler}>
    //             <NewPost onBodyChange={bodyChangeHandler} onAuthorChange={AuthorChangeHandler} />
    //         </Modal>
    //     );
    // }
    return (
        <>
            {isPosting && (
                <Modal onClose={onStopPosting}>
                    <NewPost onCancel={onStopPosting} onAddPost={addPostHandler } />
                </Modal>
            )}
            {posts.length > 0 && (
                <ul className={classes.posts}>
                {posts.map((post) => <Post key={post.body} author={post.author} body={post.body } />)}
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