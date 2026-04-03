import React, { useState } from 'react';
import { Mail, Send, Github, Facebook, Instagram, Linkedin, ExternalLink, MapPin, Award } from 'lucide-react';
import emailjs from '@emailjs/browser';
import RotatingText from '../components/bits/RotatingText';
import Swal from 'sweetalert2';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom configuration for SweetAlert2 to match your portfolio theme
  const swalConfig = {
    background: '#18181b', // Zinc-900
    color: '#ffffff',
    confirmButtonColor: '#06b6d4', // Cyan-500
    borderRadius: '24px',
    customClass: {
      popup: 'border border-zinc-800 shadow-2xl rounded-[24px]',
      title: 'text-white font-bold',
      htmlContainer: 'text-zinc-400'
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceId = 'service_ba41ykf'; 
    const templateId = 'template_36ubf89'; 
    const publicKey = 'inzhqvfwSM7IZb-Ct'; 

    const templateParams = {
      name: formState.name,
      email: formState.email,
      message: formState.message,
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        setIsSubmitting(false);
        setFormState({ name: '', email: '', message: '' });
        
        // SUCCESS ALERT
        Swal.fire({
          ...swalConfig,
          title: 'Message Sent!',
          text: "Thanks for reaching out, Kent will get back to you soon.",
          icon: 'success',
          timer: 3500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      })
      .catch((err) => {
        console.error('FAILED...', err);
        setIsSubmitting(false);
        
        // ERROR ALERT
        Swal.fire({
          ...swalConfig,
          title: 'Error!',
          text: "Failed to send message. Please check your connection or try again.",
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      });
  };

  const inputClasses = "w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)]";

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/kazutokei',
      color: 'hover:text-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
      iconColor: 'group-hover:text-white'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/kent.john03',
      color: 'hover:text-blue-500 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
      iconColor: 'group-hover:text-blue-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/e.knnt/',
      color: 'hover:text-pink-500 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]',
      iconColor: 'group-hover:text-pink-500'
    },
    {
      name: 'ORCID iD',
      icon: Award, 
      url: 'https://orcid.org/0009-0007-8788-664X',
      color: 'hover:text-emerald-500 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      iconColor: 'group-hover:text-emerald-500'
    }
  ];

  return (
    <section id="contact" className="relative min-h-screen bg-transparent px-6 pt-24 pb-32 flex flex-col justify-center overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        
        <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Get In Touch</h2>
          <div className="w-16 h-1.5 bg-cyan-500 rounded-full mx-auto shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-5 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150 px-2 sm:px-0">
            <div className="text-4xl md:text-5xl font-black text-white leading-[1.3] mb-8 flex flex-col items-start gap-1">
              <span>Let's build</span>
              <span>something</span>
              <div className="mt-1">
                <RotatingText
                  texts={['meaningful.', 'impactful.', 'fun.', 'innovative.', 'scalable.']}
                  mainClassName="px-4 md:px-5 bg-cyan-400 text-black overflow-hidden py-1.5 md:py-2 justify-center rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] tracking-tight"
                  staggerFrom={"last"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                />
              </div>
            </div>
            
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-md">
              Whether you have a project in mind, a question about my work, or just want to say hi, my inbox is always open.
            </p>

            <div className="space-y-6 mb-10 w-full max-w-full">
              <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-zinc-900 border border-zinc-800 rounded-2xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] w-full overflow-hidden">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 text-cyan-400 border border-cyan-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Email Me At</p>
                  <a href="mailto:chavo.kentjohn@gmail.com" className="text-white font-medium hover:text-cyan-400 transition-colors text-sm sm:text-lg break-all sm:break-normal">
                    chavo.kentjohn@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-zinc-900 border border-zinc-800 rounded-2xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] w-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 text-cyan-400 border border-cyan-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-white font-medium text-sm sm:text-lg">
                    Cagayan de Oro City, Philippines
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-full">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Connect with me</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className={`w-5 h-5 text-zinc-400 transition-colors ${social.iconColor}`} />
                    <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">{social.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-auto text-zinc-600 group-hover:text-current opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                  </a>
                ))}

                <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-950/50 border border-zinc-900 text-zinc-600 cursor-not-allowed select-none">
                  <Linkedin className="w-5 h-5 opacity-50" />
                  <span className="font-medium opacity-50">LinkedIn</span>
                  <span className="ml-auto text-[9px] uppercase tracking-widest font-extrabold bg-zinc-900 text-zinc-500 px-2 py-1 rounded flex items-center gap-1 border border-zinc-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 animate-pulse"></span>
                    Soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 mt-10 lg:mt-0">
            <div className="bg-zinc-900 border border-zinc-800/60 p-6 sm:p-8 md:p-10 rounded-[32px] shadow-2xl relative overflow-hidden group/form">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none group-hover/form:bg-cyan-500/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none group-hover/form:bg-purple-500/10 transition-colors duration-500" />

              <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-semibold text-zinc-400 ml-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-semibold text-zinc-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-semibold text-zinc-400 ml-1">Your Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    placeholder="How can I help you?"
                    rows={5}
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="relative w-full overflow-hidden rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 h-14 bg-white text-black hover:bg-cyan-50 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;