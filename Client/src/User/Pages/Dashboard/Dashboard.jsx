import React, { useState, useEffect } from "react";
import {
  FiHeart,
  FiSearch,
  FiMapPin,
  FiHome,
  FiUsers,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiClock,
  FiCamera,
  FiChevronRight,
  FiAward,
  FiCheckCircle,
  FiSun,
  FiCloud,
  FiDollarSign,
  FiCalendar,
  FiMessageCircle,
  FiShare2,
  FiMoreVertical,
  FiFilter,
  FiGrid,
  FiList,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut
} from "react-icons/fi";
import { FaRegGem, FaSwimmingPool, FaWifi, FaCar, FaSnowflake } from "react-icons/fa";
import { MdOutlineBalcony, MdOutlineSecurity } from "react-icons/md";
import { GiModernCity, GiTreehouse, GiVillage } from "react-icons/gi";
import axios from "axios";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [houses, setHouses] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [weather, setWeather] = useState({ temp: 24, condition: "Sunny" });
  const [stats, setStats] = useState({
    total_users: 0,
    total_owners: 0,
    total_houses: 0,
    active_houses: 0,
  });



  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    if (!uid) {
      window.location.href = "/";
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/Userprofile/${uid}/`)
      .then((res) => {
        if (res.data.data.length > 0) {
          setUser(res.data.data[0]);
        }
      });
  }, [uid]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/House/")
      .then((res) => setHouses(res.data.data));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/DashboardStats/")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);
  const toggleSaveProperty = (id) => {
    setSavedProperties((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      if (!prev.includes(id)) {
        triggerConfetti();
      }

      return updated;
    });
  };

  const triggerConfetti = () => {
    // Simple confetti effect simulation
    const confetti = document.createElement('div');
    confetti.className = styles.confetti;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1000);
  };

  const categories = [
    { id: "all", label: "All", icon: <FiHome /> },
    { id: "apartment", label: "Apartment", icon: <GiModernCity /> },
    { id: "villa", label: "Villa", icon: <GiVillage /> },
    { id: "penthouse", label: "Penthouse", icon: <FaRegGem /> },
    { id: "studio", label: "Studio", icon: <GiTreehouse /> }
  ];

  const amenities = [
    { icon: <FaSwimmingPool />, label: "Pool" },
    { icon: <FaWifi />, label: "WiFi" },
    { icon: <FaCar />, label: "Parking" },
    { icon: <FaSnowflake />, label: "AC" },
    { icon: <MdOutlineBalcony />, label: "Balcony" },
    { icon: <MdOutlineSecurity />, label: "Security" }
  ];
  const agentsData = [
    {
      name: "Rahul Varma",
      role: "Property Consultant",
      avatar: "https://i.pravatar.cc/300?img=12" // male
    },
    {
      name: "Anjali Menon",
      role: "Rental Specialist",
      avatar: "https://i.pravatar.cc/300?img=47" // female
    },
    {
      name: "Amit Kapoor",
      role: "Investment Expert",
      avatar: "https://i.pravatar.cc/300?img=15" // male
    },
    {
      name: "Sneha Iyer",
      role: "Luxury Advisor",
      avatar: "https://i.pravatar.cc/300?img=49" // female
    },
    {
      name: "Arjun Nair",
      role: "Client Relations Manager",
      avatar: "https://i.pravatar.cc/300?img=18" // male
    }
  ];

  const testimonialsData = [
    {
      text: "Listings were genuine and regularly updated. I found my apartment without broker spam.",
      name: "Rahul Nair",
      role: "Software Engineer"
    },
    {
      text: "Smooth experience from search to finalizing. Agent support was excellent.",
      name: "Anita George",
      role: "HR Manager"
    },
    {
      text: "Clear pricing, real photos, and no fake ads. Highly recommended platform.",
      name: "Arjun Pillai",
      role: "Startup Founder"
    }
  ];



  const filteredHouses = houses
    .filter((h) =>
      (selectedCategory === "all" ||
        h.house_details.toLowerCase().includes(selectedCategory)) &&

      (
        h.house_details.toLowerCase().includes(search.toLowerCase()) ||
        (h.place__place_name || "").toLowerCase().includes(search.toLowerCase())
      ) &&

      Number(h.house_price) >= selectedPriceRange[0] &&
      Number(h.house_price) <= selectedPriceRange[1]
    )
    .filter((h) => !showSavedOnly || savedProperties.includes(h.id));

  const displayHouses =
    filteredHouses.length > 0 ? filteredHouses : houses;


  const totalProperties = houses.length;
  const savedCount = savedProperties.length;

  const heroSlides = [
    {
      title: "Homes That Match Your Lifestyle",
      subtitle: "Handpicked residences across the city with verified owners",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400",
      tagline: "Live better, live smarter"
    },
    {
      title: "Rent. Buy. Invest.",
      subtitle: "From budget homes to luxury villas — everything in one place",
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200",
      tagline: "Your property partner"
    },
    {
      title: "Find Homes Near What Matters",
      subtitle: "Close to offices, schools, metros & lifestyle hubs",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
      tagline: "Location matters"
    }
  ];


  if (!user) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}>
          <div className={styles.loaderSquare}></div>
          <div className={styles.loaderSquare}></div>
          <div className={styles.loaderSquare}></div>
          <div className={styles.loaderSquare}></div>
          <div className={styles.loaderSquare}></div>
          <div className={styles.loaderSquare}></div>
        </div>
        <p className={styles.loadingText}>Crafting your experience...</p>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* HERO SECTION WITH PARALLAX */}
      <section className={styles.hero}>
        <div className={styles.heroSlides}>
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.heroSlide} ${currentSlide === index ? styles.activeSlide : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={styles.heroOverlay}>
                <div className={styles.heroContent}>
                  <span className={styles.slideTagline}>{slide.tagline}</span>
                  <h1 className={styles.heroTitle}>{slide.title}</h1>
                  <p className={styles.heroSubtitle}>{slide.subtitle}</p>

                  <div className={styles.heroSearch}>
                    <div className={styles.searchContainer}>
                      <FiSearch className={styles.searchIcon} />
                      <input
                        type="text"
                        placeholder="Search by location, property type, or features..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <button className={styles.searchBtn}>
                      <FiSearch />
                      <span>Search</span>
                    </button>
                  </div>

                  <div className={styles.heroStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.active_houses}+</span>
                      <span className={styles.statLabel}>Active Properties</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.total_users}+</span>
                      <span className={styles.statLabel}>Happy Tenants</span>
                    </div>
                    <div className={styles.statDivider}></div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.total_owners}+</span>
                      <span className={styles.statLabel}>Owners</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.slideControls}>
          <button
            className={styles.slidePrev}
            onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
          >
            ←
          </button>
          <div className={styles.slideDots}>
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                className={`${styles.slideDot} ${currentSlide === index ? styles.activeDot : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          <button
            className={styles.slideNext}
            onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
          >
            →
          </button>
        </div>

        <div className={styles.weatherWidget}>
          <FiSun />
          <span>{weather.temp}°C | {weather.condition}</span>
        </div>
      </section>

      {/* WELCOME BANNER */}
      <section className={styles.welcomeBanner}>
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeText}>
            <h2>Hello {user.user_name || 'there'} 👋</h2>
            <p>
              Explore {totalProperties}+ verified homes, handpicked just for you.
              Save your favourites and connect directly with owners.
            </p>

          </div>
          <div className={styles.welcomeActions}>
            <button className={styles.primaryAction}>
              <FiTrendingUp />
              View Recommendations
            </button>
            <button className={styles.secondaryAction}>
              <FiMessageCircle />
              Chat with Agent
            </button>
          </div>
        </div>
      </section>

      {/* QUICK STATS WITH ANIMATION */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard} data-aos="fade-up">
            <div className={styles.statIconWrapper} style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' }}>
              <FiHome />
            </div>
            <div className={styles.statDetails}>
              <h3>{totalProperties}</h3>
              <p>Total Properties</p>
              <span className={styles.statTrend}>+12% this week</span>
            </div>
          </div>

          <div className={styles.statCard} data-aos="fade-up" data-aos-delay="100">
            <div className={styles.statIconWrapper} style={{ background: 'linear-gradient(135deg, #4ECDC4, #556270)' }}>
              <FiHeart />
            </div>
            <div className={styles.statDetails}>
              <h3>{savedCount}</h3>
              <p>Saved Properties</p>
              <span className={styles.statTrend}>{savedCount > 0 ? 'Active favorites' : 'Start saving'}</span>
            </div>
          </div>

          <div className={styles.statCard} data-aos="fade-up" data-aos-delay="200">
            <div className={styles.statIconWrapper} style={{ background: 'linear-gradient(135deg, #A8E6CF, #3B9E8E)' }}>
              <FiUsers />
            </div>
            <div className={styles.statDetails}>
              <h3>24/7</h3>
              <p>Support Available</p>
              <span className={styles.statTrend}>Live agents online</span>
            </div>
          </div>

          <div className={styles.statCard} data-aos="fade-up" data-aos-delay="300">
            <div className={styles.statIconWrapper} style={{ background: 'linear-gradient(135deg, #FFD93D, #FF9F1C)' }}>
              <FiAward />
            </div>
            <div className={styles.statDetails}>
              <h3>4.9</h3>
              <p>User Rating</p>
              <span className={styles.statTrend}>Top-rated platform</span>
            </div>
          </div>
        </div>
      </section>


      {/* MAIN CONTENT WITH FILTERS */}
      <section className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <div className={styles.filterBar}>
            <button
              className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter />
              <span>Filters</span>
            </button>

            <div className={styles.quickFilters}>
              <button
                className={`${styles.quickFilter} ${!showSavedOnly ? styles.activeQuickFilter : ''}`}
                onClick={() => setShowSavedOnly(false)}
              >
                All Properties
              </button>
              <button
                className={`${styles.quickFilter} ${showSavedOnly ? styles.activeQuickFilter : ''}`}
                onClick={() => setShowSavedOnly(true)}
              >
                <FiHeart />
                Saved ({savedCount})
              </button>
            </div>
          </div>

          <div className={styles.resultsInfo}>
            <span>Showing {displayHouses.length} properties</span>
            <select className={styles.sortSelect}>
              <option>Most Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterGroup}>
              <h4>Price Range</h4>
              <div className={styles.priceRange}>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={selectedPriceRange[1]}
                  onChange={(e) => setSelectedPriceRange([0, parseInt(e.target.value)])}
                />
                <div className={styles.priceInputs}>
                  <span>${selectedPriceRange[0]}</span>
                  <span>-</span>
                  <span>${selectedPriceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h4>Amenities</h4>
              <div className={styles.amenitiesGrid}>
                {amenities.map((item, index) => (
                  <label key={index} className={styles.amenityCheckbox}>
                    <input type="checkbox" />
                    <span className={styles.checkboxIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h4>Property Type</h4>
              <div className={styles.propertyTypeFilters}>
                <button className={styles.typeBtn}>Apartment</button>
                <button className={styles.typeBtn}>Villa</button>
                <button className={styles.typeBtn}>Studio</button>
                <button className={styles.typeBtn}>Penthouse</button>
              </div>
            </div>
          </div>
        )}

        {/* PROPERTIES GRID/LIST */}
        <div className={`${styles.propertiesContainer} ${viewMode === 'list' ? styles.listView : ''}`}>
          {displayHouses.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsAnimation}>
                <div className={styles.sadEmoji}>🏠❓</div>
              </div>
              <h3>No properties found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button
                className={styles.resetFilters}
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setShowSavedOnly(false);
                  setSelectedPriceRange([0, 10000]);
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            displayHouses.map((house, index) => (
              <div
                key={house.id}
                className={`${styles.propertyCard} ${hoveredCard === house.id ? styles.hovered : ''}`}
                onMouseEnter={() => setHoveredCard(house.id)}
                onMouseLeave={() => setHoveredCard(null)}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className={styles.cardMedia}>
                  <img
                    src={`http://127.0.0.1:8000/${house.house_photo}`}
                    alt="Property"
                  />
                  <div className={styles.cardBadges}>
                    <span className={styles.featuredBadge}>Featured</span>
                    <span className={styles.verifiedBadge}>
                      <FiShield /> Verified
                    </span>
                  </div>

                  <button
                    className={`${styles.saveButton} ${savedProperties.includes(house.id) ? styles.saved : ""
                      }`}
                    onClick={() => toggleSaveProperty(house.id)}
                  >
                    <FiHeart />
                  </button>

                  <div className={styles.imageGallery}>
                    <button className={styles.galleryBtn}>
                      <FiCamera />
                      8 Photos
                    </button>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3>{house.house_details}</h3>
                    <div className={styles.rating}>
                      <FiStar className={styles.starFilled} />
                      <span>{4.5 + (index % 4) * 0.1} ({80 + index * 7} reviews)</span>
                    </div>
                  </div>

                  <div className={styles.location}>
                    <FiMapPin />
                    <span>{house.place__place_name}</span>
                  </div>

                  <div className={styles.specs}>
                    <div className={styles.spec}>
                      <FiHome />
                      <span>{house.bhktype__bhktype_name}</span>
                    </div>
                    <div className={styles.spec}>
                      <FiUsers />
                      <span>{house.tenanttype__tenanttype_name}</span>
                    </div>
                    <div className={styles.spec}>
                      <FiTrendingUp />
                      <span>{house.floortype__floortype_name}</span>
                    </div>
                  </div>


                  <div className={styles.amenities}>
                    {amenities.slice(0, 4).map((amenity, idx) => (
                      <div key={idx} className={styles.amenity}>
                        {amenity.icon}
                      </div>
                    ))}
                    <span className={styles.moreAmenities}>+4</span>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceSection}>
                      <span className={styles.price}>₹{house.house_price}</span>
                      <span className={styles.perMonth}>/month</span>
                    </div>

                    <div className={styles.cardActions}>
                      <button className={styles.quickViewBtn}>Quick View</button>
                      <button className={styles.detailsBtn}>Details</button>
                    </div>
                  </div>

                  <div className={styles.availability}>
                    <FiClock />
                    <span>Status: {house.house_status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredHouses.length > 0 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled>← Prev</button>
            <button className={`${styles.pageNum} ${styles.activePage}`}>1</button>
            <button className={styles.pageNum}>2</button>
            <button className={styles.pageNum}>3</button>
            <span>...</span>
            <button className={styles.pageNum}>10</button>
            <button className={styles.pageBtn}>Next →</button>
          </div>
        )}
      </section>


      {/* PREMIUM AGENTS SECTION */}
      <section className={styles.premiumAgents}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Meet Our Premium Agents</h2>
            <p>Expert guidance from industry professionals</p>
          </div>
          <button className={styles.viewAllAgents}>
            View All Agents <FiChevronRight />
          </button>
        </div>

        <div className={styles.agentsSlider}>
          {[1, 2, 3, 4, 5].map((agent) => (
            <div key={agent} className={styles.agentSlide}>
              <div className={styles.agentCard}>
                <div className={styles.agentMedia}>
                  <img
                    src={agentsData[agent - 1].avatar}
                    alt={agentsData[agent - 1].name}
                  />
                  <div className={styles.agentStatus}>Online</div>
                  <div className={styles.agentRank}>
                    <FiAward /> Top 1%
                  </div>
                </div>

                <div className={styles.agentInfo}>
                  <h4>{agentsData[agent - 1].name}</h4>
                  <p>{agentsData[agent - 1].role}</p>


                  <div className={styles.agentStats}>
                    <div className={styles.agentStat}>
                      <span className={styles.agentStatValue}>124</span>
                      <span className={styles.agentStatLabel}>Properties</span>
                    </div>
                    <div className={styles.agentStat}>
                      <span className={styles.agentStatValue}>4.9</span>
                      <span className={styles.agentStatLabel}>Rating</span>
                    </div>
                    <div className={styles.agentStat}>
                      <span className={styles.agentStatValue}>8y</span>
                      <span className={styles.agentStatLabel}>Experience</span>
                    </div>
                  </div>

                  <button className={styles.agentContactBtn}>
                    <FiMessageCircle />
                    Contact Agent
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS WITH CARDS */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsHeader}>
          <h2>What Our Clients Say</h2>
          <p>Real stories from people who found their dream homes with us</p>
        </div>

        <div className={styles.testimonialsGrid}>
          {[1, 2, 3].map((testimonial) => (
            <div key={testimonial} className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={styles.testimonialStar} />
                ))}
              </div>
              <p className={styles.testimonialText}>
                {testimonialsData[testimonial - 1].text}
              </p>

              <div className={styles.testimonialAuthor}>
                <img src={`https://i.pravatar.cc/60?img=${testimonial + 40}`} alt="Author" />
                <div>
                  <h4>{testimonialsData[testimonial - 1].name}</h4>
                  <p>{testimonialsData[testimonial - 1].role}</p>

                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <h2>Ready to Find Your Dream Home?</h2>
            <p>Join thousands of happy homeowners who found their perfect property with us</p>
            <div className={styles.ctaButtons}>
              <button className={styles.ctaPrimary}>
                Get Started Now
                <FiChevronRight />
              </button>
              <button className={styles.ctaSecondary}>
                Schedule a Consultation
              </button>
            </div>
          </div>
          <div className={styles.ctaImage}>
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400" alt="Happy family in new home" />
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Browse by Category</h2>
            <p>Find your perfect property type</p>
          </div>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeView : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </button>
          </div>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryItem} ${selectedCategory === cat.id ? styles.activeCategory : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className={styles.categoryIcon}>{cat.icon}</span>
              <span className={styles.categoryLabel}>{cat.label}</span>
              <span className={styles.categoryCount}>
                {cat.id === 'all' ? houses.length : houses.filter(h => h.house_details.toLowerCase().includes(cat.id)).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoIcon}>🏠</span>
              <span>HOMEHUNT</span>
            </div>
            <p className={styles.footerDescription}>
              Making your dream home a reality with premium properties and expert guidance.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>📘</a>
              <a href="#" className={styles.socialLink}>🐦</a>
              <a href="#" className={styles.socialLink}>📷</a>
              <a href="#" className={styles.socialLink}>🔗</a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Properties</a></li>
              <li><a href="#">Agents</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4>Popular Locations</h4>
            <ul>
              <li><a href="#">Downtown</a></li>
              <li><a href="#">Waterfront</a></li>
              <li><a href="#">Hillside</a></li>
              <li><a href="#">Garden District</a></li>
              <li><a href="#">University Area</a></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4>Newsletter</h4>
            <p>Subscribe for exclusive deals and updates</p>
            <div className={styles.newsletter}>
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2024 HOMEHUNT. All rights reserved. Made with ❤️ for dream homes</p>
          <div className={styles.footerLegal}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP BUTTON */}
      <button className={styles.backToTop} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>
    </div>
  );
};

export default Dashboard;