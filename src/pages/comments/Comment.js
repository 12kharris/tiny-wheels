import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import ProfilePreview from "../profiles/ProfilePreview";
import { OptionsDropdown } from "../../components/OptionsDropdown";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/Comment.module.css";

const Comment = (props) => {
  const {
    id,
    Post,
    OwnerProfile,
    OwnerProfileID,
    ProfileImage,
    Username,
    Created_ago,
    Content,
    getComments,
  } = props;

  const currentUser = useCurrentUser();

  const [edit, setEdit] = useState(false);
  const [commentData, setCommentData] = useState({
    Post: Post,
    Content: Content,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getCommentData = async () => {
      if (!edit) {
        try {
          const { data } = await axiosRes.get(`/comments/${id}/`);
          setCommentData({
            Post: data.Post,
            Content: data.Content,
          });
        } catch (err) {}
      }
    };
    getCommentData();
  }, [edit, id]);

  const handleChange = (event) => {
    setCommentData({
      ...commentData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Post", Post);
    formData.append("Content", commentData.Content);

    try {
      await axiosRes.put(`/comments/${id}`, formData).then(() => {
        setEdit(false);
      });
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosReq.delete(`/comments/${id}`).then(() => {
        getComments();
      });
    } catch (err) {}
  };

  return (
    <Row style={{ alignItems: "center" }}>
      <Col xs={6} md={2} className={styles.lesspadding}>
        <Link to={`profiles/${OwnerProfileID}`}>
          <ProfilePreview
            imageURL={ProfileImage}
            text={OwnerProfile?.Length > 0 ? OwnerProfile : Username}
            height={50}
          />
        </Link>
      </Col>
      <Col xs={6} md={2} className={styles.lesspadding}>
        <span>{Created_ago}</span>
      </Col>

      <Col xs={10} md={8} className={styles.lesspadding}>
        {edit ? (
          <Row>
            <Col className={styles.lesspadding}>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col className={styles.lesspadding}>
                    <Form.Control
                      type="text"
                      name="Post"
                      value={Post}
                      hidden
                      readOnly
                    ></Form.Control>
                    <Form.Control
                      type="text"
                      name="Content"
                      value={commentData.Content}
                      onChange={handleChange}
                    ></Form.Control>
                    {errors.Content?.map((message, idx) => (
                      <Alert key={idx} variant="warning">
                        {message}
                      </Alert>
                    ))}
                  </Col>
                  <Col md={2} className={styles.lesspadding}>
                    <Button type="submit">Save</Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col xs={2} md={3}>
              <OptionsDropdown
                handleEdit={() => {
                  setEdit(!edit);
                }}
                handleDelete={handleDelete}
              />
            </Col>
          </Row>
        ) : (
          <Row className={styles.contentholder}>
            <Col style={{ textAlign: "left" }} className={styles.lesspadding}>
              {commentData.Content}
            </Col>
            {currentUser?.username == Username && (
              <Col xs={2} className={styles.lesspadding}>
                <OptionsDropdown
                  handleEdit={() => {
                    setEdit(!edit);
                  }}
                  handleDelete={handleDelete}
                />
              </Col>
            )}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default Comment;
