"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import "../styles/landing.css"

export default function LandingPage() {
  const [activeTimelineItem, setActiveTimelineItem] = useState(0)
  const router = useRouter()

  const timelineItems = [
    {
      time: "Morning",
      title: "Smart Meal Suggestions",
      description: "AI-powered breakfast recommendations based on your glucose levels and daily activity.",
      icon: "🍳",
      botMessage: "Good morning! Based on your glucose trends, would you like some healthy breakfast ideas to start your day?",
      userMessage: "Suggest some healthy breakfast ideas to start my day.",
    },
    {
      time: "Midday",
      title: "Stress & Heart-Rate Alerts",
      description: "Real-time monitoring with gentle reminders to breathe when stress levels rise.",
      icon: "❤️",
      botMessage: "I noticed your heart rate is a bit elevated. Would you like to try a quick breathing exercise to relax?",
      userMessage: "Suggest a quick breathing exercise to relax.",
    },
    {
      time: "Afternoon",
      title: "Food Recognition with AI",
      description: "Snap a photo of your meal and get instant nutritional analysis and glucose impact.",
      icon: "📸",
      botMessage: "Ready for lunch? Snap a photo of your meal and I'll analyze its nutrition for you!",
      userMessage: "Analyze the nutrition of my lunch from a photo.",
    },
    {
      time: "Evening",
      title: "Real-time Family Check-in",
      description: "Share your health status with loved ones and healthcare providers.",
      icon: "👪",
      botMessage: "Would you like to share your health summary with your family or doctor this evening?",
      userMessage: "Share my health summary with my family or doctor.",
    },
    {
      time: "Night",
      title: "Personalized Nighttime Routine",
      description: "Wind down with custom recommendations for better sleep and glucose management.",
      icon: "🌙",
      botMessage: "It's almost bedtime. Want some tips for a restful night and stable glucose levels?",
      userMessage: "Give me tips for a restful night and stable glucose levels.",
    },
  ]

  const features = [
    {
      title: "Predictive Analytics",
      description: "Advanced algorithms that learn your body's patterns",
      icon: "📊",
    },
    {
      title: "AI Meal Logging",
      description: "Effortless food tracking with image recognition",
      icon: "🍽️",
    },
    {
      title: "Smart Device Integration",
      description: "Seamless connection with watches and glucose monitors",
      icon: "⌚",
    },
    {
      title: "Telemedicine Sync",
      description: "Share data directly with your healthcare providers",
      icon: "👨‍⚕️",
    },
    {
      title: "Personalized Coaching",
      description: "AI-driven advice tailored to your unique health profile",
      icon: "🧠",
    },
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      quote: "This app has transformed how I manage my diabetes. I feel in control for the first time in years.",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Michael T.",
      quote: "The real-time alerts have prevented several low glucose episodes. It's like having a health partner.",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Jennifer K.",
      quote: "I love how it learns my patterns and gives me personalized recommendations that actually work.",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const handleYesClick = () => {
    const userMessage = timelineItems[activeTimelineItem].userMessage
    router.push(`/chatbot?input=${encodeURIComponent(userMessage)}`)
  }

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="project-title-header">
        <h1 className="project-title">DIABETICA</h1>
      </header>
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Start Your Day with a Healthier You
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI-powered routines for a smarter, stress-free life with diabetes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-buttons"
          >
            <Link href="/chatbot" className="cta-button">
              Try Your Daily Wellness Plan
            </Link>
            <Link href="/login" className="login-button">
              Login
            </Link>
          </motion.div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            <span className="image-icon">📱</span>
          </div>
        </div>
      </section>

      {/* Features Timeline */}
      <section className="timeline-section">
        <h2 className="section-title">Your Day with Health Assistant</h2>

        <div className="timeline-container">
          <div className="timeline-progress">
            <div
              className="timeline-progress-bar"
              style={{ width: `${(activeTimelineItem / (timelineItems.length - 1)) * 100}%` }}
            ></div>
          </div>

          <div className="timeline-items">
            {timelineItems.map((item, index) => (
              <div
                key={index}
                className={`timeline-item ${activeTimelineItem === index ? "active" : ""}`}
                onClick={() => setActiveTimelineItem(index)}
              >
                <div className="timeline-icon">{item.icon}</div>
                <div className="timeline-time">{item.time}</div>
              </div>
            ))}
          </div>

          <motion.div className="timeline-content"
            key={activeTimelineItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="timeline-title">{timelineItems[activeTimelineItem].title}</h3>
            <p className="timeline-description">{timelineItems[activeTimelineItem].description}</p>
            <div className="chat-bubble">
              <div className="chat-message">
                <span className="bot-icon">🤖</span>
                <p>{timelineItems[activeTimelineItem].botMessage}</p>
              </div>
              <div className="chat-options">
                <button className="chat-option" onClick={handleYesClick}>Yes, please!</button>
                <button className="chat-option">Not now</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="features-section">
        <h2 className="section-title">Why It Works</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      {/* <section className="testimonial-section">
        <h2 className="section-title">You're Not Alone</h2>
        <div className="testimonial-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-image">
                <img src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
              </div>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <p className="testimonial-name">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Let's plan tomorrow, together.</h2>
          <p className="cta-description">Start your journey to better health with our AI-powered assistant.</p>
          <Link href="/chatbot" className="cta-button">
            Try Our Data Visualization Chatbot
          </Link>
        </div>
      </section>

      {/* Floating Chatbot Button */}
      <Link href="/chatbot" className="floating-chat-button">
        <span className="chat-icon">💬</span>
        <span className="chat-text">Open Chatbot</span>
      </Link>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">Health Assistant</div>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Privacy Policy
            </a>
            <a href="#" className="footer-link">
              Contact
            </a>
            <a href="#" className="footer-link">
              FAQs
            </a>
            <a href="#" className="footer-link">
              Blog
            </a>
          </div>
          <div className="footer-social">
            <a href="#" className="social-icon">
              📱
            </a>
            <a href="#" className="social-icon">
              📘
            </a>
            <a href="#" className="social-icon">
              📸
            </a>
            <a href="#" className="social-icon">
              🐦
            </a>
          </div>
        </div>
        <div className="footer-copyright">© 2023 Health Assistant. All rights reserved.</div>
      </footer>
    </div>
  )
}
