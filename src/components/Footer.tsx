import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Heart, 
  Github, 
  Twitter, 
  Mail,
  ExternalLink,
  Gamepad2,
  MessageCircle
} from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  // Configuration des liens de partenaires
  const partners = [
    {
      name: 'ArmaTeam',
      url: 'https://armateam.org', 
      description: 'Equipe gaming'
    },
    {
      name: 'EducEsport',
      url: 'https://educ-esport.fr', 
      description: 'Formation eSport'
    }
  ]

  // Configuration des liens de navigation du footer
  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { label: 'Accueil', path: '/' },
        { label: 'Défis', path: '/defis' },
        { label: 'Équipes', path: '/equipes' },
      ]
    },
    {
      title: 'Communauté',
      links: [
        { label: 'Récompenses', path: '/recompenses' },
        { label: 'Classements', path: '/classements' },
        { label: 'Événements', path: '/evenements' },
        { label: 'Blog', path: '/blog' },
      ]
    }
  ]

  // Configuration des réseaux sociaux
  const socialLinks = [
    { icon: <MessageCircle size={20} />, url: '#', name: 'Discord' },
    { icon: <Twitter size={20} />, url: '#', name: 'Twitter' },
    { icon: <Github size={20} />, url: '#', name: 'GitHub' }
  ]

  return (
    <footer className="bg-esport-black border-t border-esport-gray-800 mt-auto">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center space-x-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient">Section eSport</h3>
                <p className="text-sm text-esport-gray-400">Lycée Jules Ferry</p>
              </div>  
            </motion.div>
            
            <motion.p 
              className="text-esport-gray-400 mb-6 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Plateforme officielle de la section eSport du lycée. Développez vos compétences, 
              participez aux compétitions inter-lycées et progressez dans vos jeux favoris.
            </motion.p>

            {/* Partenaires */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">Nos Partenaires</h4>
              <div className="flex flex-wrap gap-4">
                {partners.map((partner, index) => (
                  <motion.a
                    key={partner.name}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-esport-gray-400 hover:text-esport-purple transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Gamepad2 size={16} />
                    <span className="text-sm font-medium">{partner.name}</span>
                    <ExternalLink size={12} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Suivez-nous</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    className="p-3 bg-esport-gray-900 rounded-lg text-esport-gray-400 hover:text-white hover:bg-esport-purple transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Liens de navigation */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.path}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.path}
                      className="text-esport-gray-400 hover:text-esport-purple transition-colors duration-300 text-sm block"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-esport-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 text-sm text-esport-gray-400">
              <span>© {currentYear} </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-esport-gray-400">
              <span>Fait avec</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ['#ef4444', '#f97316', '#ef4444'] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: 'easeInOut' 
                }}
              >
                <Heart size={16} className="text-red-500" />
              </motion.div>
              <span>par la communauté</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Effet de gradient en bas */}
      <div className="h-1 bg-gradient-to-r from-esport-purple via-esport-light-purple to-esport-purple"></div>
    </footer>
  )
}

export default Footer
