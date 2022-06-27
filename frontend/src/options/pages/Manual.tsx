import * as React from 'react'
import Typography from '@mui/material/Typography';

export default function Manual() {
  
  return (
    <>
      <h1>CoSight: help blind people "see" what you see</h1>
      <div className="center">
          <h2>Why your comments may help blind people</h2>
      <p>Describing visual information can help blind and visually impaired people who cannot see the 
          video adequately. Professionals add descriptions to the original audio tracks for films and some 
          videos. It is not realistic to have every online video described by professionals or content 
          creators, however, every ordinary audience like you has the power of contributing to the 
          accessibility of the video you are watching -- by making your comment more accessible by 
          clarifying the visual, or writing a descriptive comment, especially for an inaccessible segment!</p>
      <p>When blind people are listening to the videos, we make a beep sound if helpful comments are 
          available for a segment, then they can choose to pause the video, use screen readers to
          navigate, and read out the selected comments.</p>
      
      <h2>Make your comment more accessible by clarifying the visual</h2>
      <ul>
          <li>Add timestamp if you are talking about specific segments of the video.</li>
          <li>Avoid using ambiguous pronouns, such as it, that, or this. Instead, use the full names or concepts you refer to.</li>
          <li>If you share feelings on visual content not directly covered in the audio track, describe the visual content.</li>
      </ul>
      
      <h2>Write a descriptive comment, especially for an inaccessible segment</h2>
      <ul>
          <li>Visual elements that are important to understand what the video is communicating</li>
          <ul>
              <li>Objects (e.g. ingredients needed for a recipe)</li>
              <li>Actions (e.g. a step in a tutorial video)</li>
              <li>Scenes (e.g. a person studying)</li>
              <li>Animations (e.g., an arrow showing the direction of force)</li>
              <li>Texts (e.g., additional info not mentioned in the audio)</li>
          </ul>
          <li>Don't need to describe every detail</li>
          <ul>
              <li>Apparent from the audio (e.g. host speaking to camera)</li>
              <li>Already mentioned/described in the audio</li>
          </ul>
      </ul>
      </div>
    </>
  )
}