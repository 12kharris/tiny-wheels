import React, { useEffect, useRef, useState } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import NotExists from "../../components/NotExists";
import styles from "../../styles/EditProfile.module.css";

const EditProfile = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState({});
  const imageInput = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}`);
        setProfile(data);
      } catch (err) {
        console.log(err);
      }
    };
    getProfile();
  }, [currentUser, currentUser?.profile_id, id]);

  const handleChange = (event) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [event.target.name]: event.target.value,
    }));
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      // store the image in the browser local storage
      URL.revokeObjectURL(profile.Image);
      setProfile({
        ...profile,
        ProfileImage: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    if (imageInput?.current?.files[0]) {
      formData.append("ProfileImage", imageInput.current.files[0]);
    }
    formData.append("Name", profile.Name);

    try {
        await axiosReq.put(`/profiles/${id}/`, formData);
        history.push(`/profiles/${id}`);
    }
    catch (err) {
        console.log(err.response.data);
    }
  };

  return profile?.id && profile?.OwnerUsername == currentUser?.username ? (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className={styles.formcontrols}>
          <Form.Group>
            <Form.Label htmlFor="image-upload">Change Image</Form.Label>
            <Image src={profile?.ProfileImage} />
            <Form.File
              id="image-upload"
              accept="image/*"
              name="ProfileImage"
              ref={imageInput}
              onChange={handleChangeImage}
            ></Form.File>
          </Form.Group>
        </Col>
        <Col md={8} className={styles.formcontrols}>
          <Form.Group>
            <Row>
              <Col xs={2}>
                <Form.Label>Name</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  name="Name"
                  id="Name"
                  value={profile.Name}
                  placeholder="Add a name"
                  onChange={handleChange}
                ></Form.Control>
              </Col>
            </Row>
          </Form.Group>
        </Col>
      </Row>
      <Button
        onClick={() => {
          history.goBack();
        }}
        variant="danger"
        style={{ marginRight: "20px" }}
      >
        Cancel
      </Button>
      <Button type="submit" variant="success">
        Save
      </Button>
    </Form>
  ) : (
    <NotExists />
  );
};

export default EditProfile;