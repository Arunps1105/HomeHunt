import React, { useEffect, useState } from "react";
import styles from "./EditProfile.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiX,
    FiCamera, FiCheckCircle, FiEdit2
} from 'react-icons/fi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsStars } from 'react-icons/bs';
import { RiSparklingLine } from 'react-icons/ri';

const EditProfile = () => {
    const nav = useNavigate();
    const uid = sessionStorage.getItem('uid');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [hoveredField, setHoveredField] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [particles, setParticles] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    if (!uid) return null;

    // Generate particles on mouse move
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (Math.random() > 0.9) {
                setParticles(prev => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        x: e.clientX,
                        y: e.clientY,
                        life: 1
                    }
                ].slice(-20)); // Keep only last 20 particles
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animate particles
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev =>
                prev
                    .map(p => ({ ...p, life: p.life - 0.02 }))
                    .filter(p => p.life > 0)
            );
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setAnimate(true);
        axios.get(`http://127.0.0.1:8000/Userprofile/${uid}/`)
            .then(res => {
                const u = res.data.data?.[0];

                if (u) {
                    setName(u.user_name || "");
                    setEmail(u.user_email || "");
                    setPhone(u.user_contact || "");
                    setAddress(u.user_address || "");
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching profile:", err);
                setIsLoading(false);
            });
    }, [uid]);

    const handleSave = () => {

        if (!name || !email || !phone || !address) {
            alert("Please fill all fields");
            return;
        }

        if (!email.includes("@")) {
            alert("Enter a valid email");
            return;
        }
        if (phone.length < 10) {
            alert("Enter a valid phone number");
            return;
        }

        setIsSaving(true);
        const formData = new FormData();
        formData.append("user_name", name);
        formData.append("user_email", email);
        formData.append("user_contact", phone);
        formData.append("user_address", address);

        axios.post(`http://127.0.0.1:8000/UserUpdate/${uid}/`, formData)
            .then(() => {
                setShowSuccess(true);
                setIsSaving(false);

                // Show success animation then navigate
                setTimeout(() => {
                    setShowSuccess(false);
                    setAnimate(false);
                    setTimeout(() => {
                        nav('/User/Myprofile');
                    }, 500);
                }, 1500);
            })
            .catch(err => {
                console.error(err);
                setIsSaving(false);
                alert("Update failed");
            });
    };

    const handleCancel = () => {
        setAnimate(false);
        setTimeout(() => {
            nav('/User/Myprofile');
        }, 500);
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}>
                    <div className={styles.loaderCircle}></div>
                    <div className={styles.loaderRing}></div>
                    <div className={styles.loaderRing2}></div>
                    <div className={styles.loaderText}>Loading your profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${animate ? styles.fadeIn : styles.fadeOut}`}>
            {/* Mouse trail particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className={styles.particle}
                    style={{
                        left: particle.x,
                        top: particle.y,
                        opacity: particle.life,
                        transform: `scale(${particle.life})`
                    }}
                />
            ))}

            {/* Floating animated background elements */}
            <div className={styles.floatingElements}>
                <div className={styles.floatingCircle}></div>
                <div className={styles.floatingCircle}></div>
                <div className={styles.floatingCircle}></div>
                <div className={styles.floatingSquare}></div>
                <div className={styles.floatingSquare}></div>
                <div className={styles.floatingTriangle}></div>
            </div>

            {/* Animated gradient background */}
            <div className={styles.gradientBg}>
                <div className={styles.gradientOrb}></div>
                <div className={styles.gradientOrb2}></div>
                <div className={styles.gradientOrb3}></div>
            </div>

            {/* Animated lines */}
            <div className={styles.animatedLines}>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
                <div className={styles.line}></div>
            </div>

            {/* Success overlay */}
            {showSuccess && (
                <div className={styles.successOverlay}>
                    <div className={styles.successAnimation}>
                        <FiCheckCircle className={styles.successIcon} />
                        <div className={styles.successText}>Profile Updated!</div>
                        <div className={styles.successParticles}>
                            <span></span><span></span><span></span>
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.card} style={{
                transform: `perspective(1000px) rotateX(${(mousePosition.y / window.innerHeight - 0.5) * 2}deg) rotateY(${(mousePosition.x / window.innerWidth - 0.5) * 2}deg)`
            }}>
                <div className={styles.cardGlow}></div>
                <div className={styles.cardSparkle}>
                    <RiSparklingLine />
                </div>

                {/* Back button */}
                <button onClick={handleCancel} className={styles.backButton}>
                    <IoMdArrowRoundBack />
                </button>

                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                            <FiUser className={styles.avatarIcon} />
                            <div className={styles.avatarOverlay}>
                                <FiCamera className={styles.cameraIcon} />
                            </div>
                        </div>
                        <div className={styles.avatarGlow}></div>
                        <div className={styles.avatarRings}>
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                    <div className={styles.headerText}>
                        <div className={styles.titleWrapper}>
                            <BsStars className={styles.titleIcon} />
                            <h2 className={styles.title}>Edit Profile</h2>
                        </div>
                        <p className={styles.subtitle}>
                            <span className={styles.subtitleText}>Keep your details up to date</span>
                            <span className={styles.subtitleHighlight}></span>
                        </p>
                    </div>
                </div>

                <div className={styles.form}>
                    <div className={styles.fieldGroup}>
                        {[
                            { id: 'name', icon: FiUser, label: 'Full Name', value: name, setter: setName, placeholder: 'Enter your full name' },
                            { id: 'email', icon: FiMail, label: 'Email Address', value: email, setter: setEmail, placeholder: 'Enter your email', type: 'email' },
                            { id: 'phone', icon: FiPhone, label: 'Mobile Number', value: phone, setter: setPhone, placeholder: 'Enter your phone number' },
                            { id: 'address', icon: FiMapPin, label: 'Address', value: address, setter: setAddress, placeholder: 'Enter your address' }
                        ].map(field => (
                            <div
                                key={field.id}
                                className={`${styles.field} ${hoveredField === field.id ? styles.fieldHovered : ''
                                    } ${focusedField === field.id ? styles.fieldFocused : ''}`}
                                onMouseEnter={() => setHoveredField(field.id)}
                                onMouseLeave={() => setHoveredField(null)}
                            >
                                <label className={styles.label}>
                                    <field.icon className={styles.fieldIcon} />
                                    <span className={styles.labelText}>{field.label}</span>
                                    {focusedField === field.id && (
                                        <FiEdit2 className={styles.editIcon} />
                                    )}
                                </label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type={field.type || 'text'}
                                        value={field.value}
                                        onChange={e => field.setter(e.target.value)}
                                        onFocus={() => setFocusedField(field.id)}
                                        onBlur={() => setFocusedField(null)}
                                        className={styles.input}
                                        placeholder={field.placeholder}
                                    />
                                    <div className={styles.inputBorder}></div>
                                    <div className={styles.inputGlow}></div>
                                    <div className={styles.inputSparkles}>
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={handleSave}
                            className={`${styles.saveBtn} ${isSaving ? styles.saving : ''}`}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <span className={styles.savingSpinner}></span>
                                    <span className={styles.savingText}>Saving...</span>
                                    <span className={styles.savingParticles}>
                                        <span></span><span></span><span></span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <FiSave className={styles.btnIcon} />
                                    <span>Save Changes</span>
                                    <span className={styles.btnGlow}></span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleCancel}
                            className={styles.cancelBtn}
                        >
                            <FiX className={styles.btnIcon} />
                            <span>Cancel</span>
                            <span className={styles.btnGlow}></span>
                        </button>
                    </div>
                </div>

                {/* Floating labels animation */}
                <div className={styles.floatingLabels}>
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;