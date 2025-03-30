"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../../styles/Profile.css"

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      // Update the endpoint to use the new route
      const res = await axios.get("/api/tutors/me", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      setProfile(res.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching profile:", err)
      setError("Failed to load profile. Please try again later.")
      setLoading(false)

      // If profile not found, redirect to create profile
      if (err.response && err.response.status === 404) {
        navigate("/tutor/create-profile")
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>
  if (!profile)
    return (
      <div className="no-profile">
        No profile found. <button onClick={() => navigate("/tutor/create-profile")}>Create Profile</button>
      </div>
    )

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          {profile.profilePicture ? (
            <img src={profile.profilePicture || "/placeholder.svg"} alt="Profile" className="profile-picture" />
          ) : (
            <div className="profile-picture-placeholder">No Image</div>
          )}
          <div className="profile-info">
            <h2>{profile.user?.name}</h2>
            <p>{profile.user?.email}</p>
            <p className="rating">Rating: {profile.rating} ⭐</p>
            <p className="hourly-rate">${profile.hourlyRate}/hour</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Bio</h3>
          <p>{profile.bio}</p>
        </div>

        <div className="profile-section">
          <h3>Education</h3>
          <p>{profile.education}</p>
        </div>

        <div className="profile-section">
          <h3>Experience</h3>
          <p>{profile.experience}</p>
        </div>

        <div className="profile-section">
          <h3>Subjects</h3>
          <ul className="subjects-list">
            {profile.subjects.map((subject, index) => (
              <li key={index}>{subject}</li>
            ))}
          </ul>
        </div>

        <div className="profile-section">
          <h3>Location</h3>
          <p>{profile.location}</p>
        </div>

        <div className="profile-section">
          <h3>Availability</h3>
          <p>{profile.availability}</p>
        </div>

        <div className="profile-actions">
          <button onClick={() => navigate("/tutor/edit-profile")}>Edit Profile</button>
        </div>
      </div>
    </div>
  )
}

export default Profile