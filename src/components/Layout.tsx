import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import Footer from './Footer'

// Interface pour les props du Layout
interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Animation pour le contenu principal
  const mainVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <div className="min-h-screen bg-esport-black flex flex-col">
      {/* Navigation */}
      <Navbar />
      
      {/* Contenu principal */}
      <motion.main 
        className="flex-1 relative pt-16"
        variants={mainVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Dégradé de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-esport-black via-esport-black to-esport-dark-purple/20 pointer-events-none" />
        
        {/* Contenu */}
        <div className="relative z-10">
          {children || <Outlet />}
        </div>
      </motion.main>
      
      {/* Footer */}
      <Footer />
      
      {/* Notifications Toast */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#FFFFFF',
            border: '1px solid #374151',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#7C3AED',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
          loading: {
            iconTheme: {
              primary: '#7C3AED',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  )
}

export default Layout

