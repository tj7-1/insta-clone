import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../App'
import {Link} from 'react-router-dom';

const SubscribedUser = () => {

    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                setData(result.allposts);
            })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData);
            })
    }

    return (
        <>
            <div className="home">
                    {
                        data.map(item => {
                            return (
                                <div className="card" key={item._id}>
                                    <h5><Link to={item.postedBy._id !== state._id ? '/Profile/'+item.postedBy._id : "/Profile"}>{item.postedBy.name}</Link>
                                        {item.postedBy._id == state._id
                                            &&
                                            <i className="far fa-trash-alt" style={{ float: "right" }}
                                                onClick={() => deletePost(item._id)}
                                            ></i>}
                                    </h5>
                                    {/* <div className="card-img"> */}
                                        <img src={item.photo} alt="" style={{ width: "160px", height: "160px" }} />
                                    {/* </div> */}
                                    <div className="card-content">
                                        {item.like.includes(state._id)
                                            ?
                                            <i className="fas fa-heart" style={{ color: "red" }} onClick={() => { unlikePost(item._id) }}></i>
                                            :

                                            <i className="far fa-heart " onClick={() => { likePost(item._id) }}></i>
                                        }
                                        <h6>{item.like.length}</h6>
                                        <h6>{item.title}</h6>
                                        <p>{item.body}</p>
                                        {
                                            item.comments.map(record => {
                                                return (
                                                    <h6 key={record._id}><span style={{ fontWeight: "800" }}>{record.postedBy.name}</span>  {record.text}</h6>
                                                )
                                            })
                                        }
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            makeComment(event.target[0].value, item._id)
                                        }}>
                                            <input type="text" placeholder="Add a comment" />
                                        </form>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

        </>
    )
}
export default SubscribedUser;