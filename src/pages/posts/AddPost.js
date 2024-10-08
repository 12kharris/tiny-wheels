import React, { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Button, Form, Image } from "react-bootstrap";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AddPost = () => {
  const currentUser = useCurrentUser();
  const history = useHistory();
  const [tags, setTags] = useState([]);
  const [postFormData, setPostFormData] = useState({
    Title: "",
    Caption: "",
    Image: "",
    Tag: null,
  });
  const { title, caption, image, tag } = postFormData;
  const imageInput = useRef(null);

  useEffect(() => {
    const getTags = async () => {
      try {
        const { data } = await axiosReq.get("/tags/");
        setTags(data.results);
        setPostFormData({
            ...postFormData,
            Tag: data.results[0].id
        })
      } catch (err) {
        console.log(err);
      }
    };
    getTags();
  }, []);

  const handleChange = (event) => {
    setPostFormData({
      ...postFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      // store the image in the browser local storage
      URL.revokeObjectURL(image);
      setPostFormData({
        ...postFormData,
        Image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Title", postFormData.Title);
    formData.append("Caption", postFormData.Caption);
    formData.append("Image", imageInput.current.files[0]);
    formData.append("Tag", postFormData.Tag);
    
    try {
        const {data} = await axiosReq.post("/posts/", formData);
        history.push("/new/");
    }
    catch (err) {
        console.log(err.response.data);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="Title"
          id="Title"
          value={title}
          onChange={handleChange}
        ></Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Caption</Form.Label>
        <Form.Control
          type="text"
          name="Caption"
          id="Caption"
          value={caption}
          onChange={handleChange}
        ></Form.Control>
      </Form.Group>
      <Form.Group>
        
        {image ? (
            <>
            <Form.Label htmlFor="image-upload">Change Image</Form.Label>
            <Image src={image} />
            </>
        ) : (
            <Form.Label htmlFor="image-upload">Upload an image</Form.Label>
        )}
        <Form.File
          id="image-upload"
          accept="image/*"
          name="Image"
          ref={imageInput}
          onChange={handleChangeImage}
        ></Form.File>
      </Form.Group>
      <Form.Group>
        <Form.Label>Tag</Form.Label>
        <Form.Control as="select" onChange={handleChange} name="Tag">
          {tags?.map((tag) => (
                <option key={tag.id} value={tag.id}>{tag.TagName}</option> 
          ))}
        </Form.Control>
      </Form.Group>
      <Button type="submit">Create</Button>
    </Form>
  );
};

export default AddPost;
