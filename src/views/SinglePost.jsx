import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function SinglePost({ loggedIn }) {
	const params = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState({ title: "", content: "" });
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	useEffect(() => {
		if (!loggedIn)
			fetch(`http://localhost:5000/api/posts/${params.postId}`)
				.then((res) => res.json())
				.then((data) => {
					setPost(data);
					setTitle(data.title);
					setContent(data.content);
				});
	}, [params.postId]);

	async function handleSubmit(e) {
		e.preventDefault();

		// Get the updated data from the form
		let updatedTitle = title;
		let updatedContent = content;

		// Get the JWT token from localStorage
		let token = localStorage.getItem("token");

		// Set up the request headers
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", `Bearer ${token}`);

		// Set up the request body
		let requestBody = JSON.stringify({
			title: updatedTitle,
			content: updatedContent,
		});

		// Make the fetch request
		let response = await fetch(
			`http://localhost:5000/api/posts/${params.postId}`,
			{
				method: "PUT",
				headers: myHeaders,
				body: requestBody,
			}
		);

		let data = await response.json();

		if (data.error) {
			console.log(data.error, "danger");
			navigate("/login");
		} else {
			console.log(`${data.title} has been updated`, "success");
			navigate("/");
		}
	}

     async function handleDelete(e) {
				e.preventDefault();

				// Get the JWT token from localStorage
				let token = localStorage.getItem("token");

				// Set up the request headers
				let myHeaders = new Headers();
				myHeaders.append("Authorization", `Bearer ${token}`);

				// Make the fetch request
				let response = await fetch(
					`http://localhost:5000/api/posts/${params.postId}`,
					{
						method: "DELETE",
						headers: myHeaders,
					}
				);

				let data = await response.json();

				if (data.error) {
					console.log(data.error, "danger");
				} else {
					console.log(`${data.success}`, "success");
					navigate("/");
				}
			}
    
	return (
		<>
			<h3 className="text-center">{post.title}</h3>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Title</label>
					<input
						type="text"
						name="title"
						className="form-control mb-4"
						placeholder="Enter Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<div className="form-=group">
						<label>Body</label>
						<textarea
							name="content"
							className="form-control my-2 rows-12"
							placeholder="Enter Body"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					</div>
					<div className="btn-group">
						<input
							type="submit"
							value="Update Post"
							className="btn btn-success w-900 h-900 m-"
						/>
						<button className="btn btn-danger col-lg- m" onClick={handleDelete}>
							Delete Post
						</button>
					</div>
				</div>
			</form>
		</>
	);
}
