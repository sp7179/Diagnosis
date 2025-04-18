"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import "../styles/landing.css"
import { v4 as uuidv4 } from "uuid"

export default function LandingPage() {
  const [activeTimelineItem, setActiveTimelineItem] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState([]) // <-- Notification state

  const [sessionId, setSessionId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("session_id") || uuidv4()
    }
    return uuidv4()
  })

  useEffect(() => {
    if (typeof window !== "undefined" && sessionId) {
      localStorage.setItem("session_id", sessionId)
    }
  }, [sessionId])

  const timelineItems = [
    {
      time: "Morning",
      title: "Smart Meal Suggestions",
      description: "AI-powered breakfast recommendations based on your glucose levels and daily activity.",
      icon: "🍳",
    },
    {
      time: "Midday",
      title: "Stress & Heart-Rate Alerts",
      description: "Real-time monitoring with gentle reminders to breathe when stress levels rise.",
      icon: "❤️",
    },
    {
      time: "Afternoon",
      title: "Food Recognition with AI",
      description: "Snap a photo of your meal and get instant nutritional analysis and glucose impact.",
      icon: "📸",
    },
    {
      time: "Evening",
      title: "Real-time Family Check-in",
      description: "Share your health status with loved ones and healthcare providers.",
      icon: "👪",
    },
    {
      time: "Night",
      title: "Personalized Nighttime Routine",
      description: "Wind down with custom recommendations for better sleep and glucose management.",
      icon: "🌙",
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

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      if (!isLoading) {
        const response = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            userInput: "", // Empty input to just check for triggers
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.autoTrigger) {
            setNotifications((prev) => [
              ...prev,
              {
                id: uuidv4(),
                message: data.autoTrigger,
                time: new Date().toLocaleTimeString(),
              },
            ]);
          }
        }
      }
    }, 2 * 60 * 1000); // 2 minutes
  
    return () => clearInterval(pollInterval);
  }, [sessionId, isLoading]);

  return (
    <div className="landing-container">
      {/* Notification Panel */}
      {notifications.length > 0 && (
        <div className="notification-panel" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          background: "#1976d2",
          color: "#fff",
          padding: "12px 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          {notifications.map((notif) => (
            <div key={notif.id} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span style={{ fontSize: "1.5rem" }}>🍽️</span>
              <span>{notif.message}</span>
              <span style={{ marginLeft: "auto", fontSize: "0.9rem", opacity: 0.7 }}>{notif.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hero Section */}
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

          <motion.div
            className="timeline-content"
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
                <p>I noticed your glucose is trending up. Would you like some low-carb lunch options?</p>
              </div>
              <div className="chat-options">
                <button className="chat-option">Yes, please!</button>
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
