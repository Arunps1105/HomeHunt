import React, { useState } from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['All', 'Trending', 'Luxury', 'Budget', 'Family', 'Studio', 'Penthouse'];
  const propertyTypes = ['Apartments', 'Villas', 'PG/Hostels', 'Farmhouses', 'Commercial'];

  return (
    <div className={styles.wrapper}>
      {/* Original Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.highlight}>HomeHunt</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your gateway to finding the perfect home. Thousands of verified properties waiting for you.
          </p>

          <div className={styles.ctaContainer}>
            <button className={styles.primaryCtaBtn}>
              🏠 Browse Properties
            </button>
            <button className={styles.secondaryCtaBtn}>
              📝 List Your Property
            </button>
          </div>

        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏢</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>10,000+</div>
              <div className={styles.statLabel}>Properties Listed</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>😊</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>5,000+</div>
              <div className={styles.statLabel}>Happy Customers</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📍</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>Cities Covered</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏱️</div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>24h</div>
              <div className={styles.statLabel}>Avg. Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Hero Banner - Extraordinary Version */}
      <div className={styles.aiHeroBanner}>
        <div className={styles.heroBackground}>
          <div className={styles.floatingElement}></div>
          <div className={styles.floatingElement}></div>
          <div className={styles.floatingElement}></div>
        </div>
        <div className={styles.aiHeroContent}>
          <div className={styles.badgeContainer}>
            <span className={styles.heroBadge}>🏆 #1 Property Portal in Kerala</span>
            <span className={styles.heroBadge}>✨ 500+ Premium Partners</span>
          </div>

          <h1 className={styles.aiHeroTitle}>
            Discover Your <span className={styles.gradientText}>Dream Home</span>
            <br />With AI-Powered Search
          </h1>

          <p className={styles.aiHeroSubtitle}>
            Advanced AI algorithms match you with perfect properties based on your lifestyle,
            preferences, and budget. Experience the future of home hunting.
          </p>

          {/* Enhanced Search Bar */}
          <div className={styles.heroSearch}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInput}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by location, property type, or amenities..."
                  className={styles.searchField}
                />
              </div>
              <div className={styles.searchFilters}>
                <select className={styles.filterSelect}>
                  <option>Any Type</option>
                  {propertyTypes.map(type => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                <select className={styles.filterSelect}>
                  <option>Any Budget</option>
                  <option>₹10-20K</option>
                  <option>₹20-40K</option>
                  <option>₹40-80K</option>
                  <option>₹80K+</option>
                </select>
                <button className={styles.searchButton}>
                  <span className={styles.searchButtonIcon}>⚡</span>
                  Smart Search
                </button>
              </div>
            </div>

            <div className={styles.searchSuggestions}>
              <span className={styles.suggestion}>Trending: </span>
              <span className={styles.suggestionTag}>Sea View</span>
              <span className={styles.suggestionTag}>Smart Home</span>
              <span className={styles.suggestionTag}>Pet Friendly</span>
              <span className={styles.suggestionTag}>Near Metro</span>
              <span className={styles.suggestionTag}>Gated Community</span>
            </div>
          </div>

          <div className={styles.aiCtaContainer}>
            <button className={styles.aiPrimaryCtaBtn}>
              <span className={styles.btnIcon}>🎯</span>
              AI Match Finder
              <span className={styles.btnSubtext}>Get Personalized Recommendations</span>
            </button>
            <button className={styles.aiSecondaryCtaBtn}>
              <span className={styles.btnIcon}>📱</span>
              Virtual Tour
              <span className={styles.btnSubtext}>3D Walkthrough Available</span>
            </button>
            <button className={styles.aiTertiaryCtaBtn}>
              <span className={styles.btnIcon}>📊</span>
              Market Insights
              <span className={styles.btnSubtext}>Live Price Trends</span>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={styles.trustBar}>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🔐</div>
            <div className={styles.trustText}>Bank-Level Security</div>
          </div>
          <div className={styles.trustDivider}></div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🤖</div>
            <div className={styles.trustText}>AI-Verified Listings</div>
          </div>
          <div className={styles.trustDivider}></div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>⚖️</div>
            <div className={styles.trustText}>Legal Compliance Check</div>
          </div>
          <div className={styles.trustDivider}></div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}>🏅</div>
            <div className={styles.trustText}>ISO 27001 Certified</div>
          </div>
        </div>
      </div>

      {/* Main Content - Original Featured Properties Section */}
      <main className={styles.mainContent}>

        {/* Featured Properties Section */}
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🔥 Trending Properties</h2>
            <a href="#" className={styles.viewAllLink}>View All →</a>
          </div>

          <div className={styles.propertiesGrid}>
            {/* Property Card 1 */}
            <div className={styles.propertyCard}>
              <div className={styles.propertyImageContainer}>
                <div className={styles.propertyImage}>
                  <img
                    src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Modern 3 BHK Apartment"
                    className={styles.propertyImg}
                  />
                  <div className={styles.propertyBadge}>HOT DEAL</div>
                  <div className={styles.propertyActions}>
                    <button className={styles.wishlistBtn}>❤️</button>
                  </div>
                </div>
              </div>
              <div className={styles.propertyInfo}>
                <div className={styles.propertyHeader}>
                  <h3 className={styles.propertyTitle}>Luxury 3 BHK Apartment</h3>
                  <span className={styles.propertyPrice}>₹35,000<span className={styles.priceUnit}>/month</span></span>
                </div>
                <div className={styles.propertyLocation}>
                  <span>📍 Kochi, Kerala</span>
                  <div className={styles.propertyRating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span className={styles.ratingNumber}>4.8</span>
                  </div>
                </div>
                <div className={styles.propertyFeatures}>
                  <div className={styles.feature}>
                    <span>🛏️</span>
                    <span>3 BHK</span>
                  </div>
                  <div className={styles.feature}>
                    <span>📐</span>
                    <span>1500 sq.ft</span>
                  </div>
                  <div className={styles.feature}>
                    <span>🛋️</span>
                    <span>Furnished</span>
                  </div>
                </div>
                <div className={styles.propertyFooter}>
                  <span className={styles.postedTime}>Posted 2h ago</span>
                  <button className={styles.contactBtn}>Contact Owner</button>
                </div>
              </div>
            </div>

            {/* Property Card 2 */}
            <div className={styles.propertyCard}>
              <div className={styles.propertyImageContainer}>
                <div className={styles.propertyImage}>
                  <img
                    src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Modern 2 BHK Flat"
                    className={styles.propertyImg}
                  />
                  <div className={styles.propertyBadgePremium}>PREMIUM</div>
                  <div className={styles.propertyActions}>
                    <button className={styles.wishlistBtn}>❤️</button>
                  </div>
                </div>
              </div>
              <div className={styles.propertyInfo}>
                <div className={styles.propertyHeader}>
                  <h3 className={styles.propertyTitle}>Modern 2 BHK Flat</h3>
                  <span className={styles.propertyPrice}>₹22,000<span className={styles.priceUnit}>/month</span></span>
                </div>
                <div className={styles.propertyLocation}>
                  <span>📍 Trivandrum, Kerala</span>
                  <div className={styles.propertyRating}>
                    <span className={styles.stars}>★★★★☆</span>
                    <span className={styles.ratingNumber}>4.5</span>
                  </div>
                </div>
                <div className={styles.propertyFeatures}>
                  <div className={styles.feature}>
                    <span>🛏️</span>
                    <span>2 BHK</span>
                  </div>
                  <div className={styles.feature}>
                    <span>📐</span>
                    <span>1100 sq.ft</span>
                  </div>
                  <div className={styles.feature}>
                    <span>🚗</span>
                    <span>Parking</span>
                  </div>
                </div>
                <div className={styles.propertyFooter}>
                  <span className={styles.postedTime}>Posted Today</span>
                  <button className={styles.contactBtn}>Contact Owner</button>
                </div>
              </div>
            </div>

            {/* Property Card 3 */}
            <div className={styles.propertyCard}>
              <div className={styles.propertyImageContainer}>
                <div className={styles.propertyImage}>
                  <img
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Beach View Villa"
                    className={styles.propertyImg}
                  />
                  <div className={styles.propertyBadge}>SALE</div>
                  <div className={styles.propertyActions}>
                    <button className={styles.wishlistBtn}>❤️</button>
                  </div>
                </div>
              </div>
              <div className={styles.propertyInfo}>
                <div className={styles.propertyHeader}>
                  <h3 className={styles.propertyTitle}>Beach View Villa</h3>
                  <span className={styles.propertyPrice}>₹75,000<span className={styles.priceUnit}>/month</span></span>
                </div>
                <div className={styles.propertyLocation}>
                  <span>📍 Calicut, Kerala</span>
                  <div className={styles.propertyRating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span className={styles.ratingNumber}>4.9</span>
                  </div>
                </div>
                <div className={styles.propertyFeatures}>
                  <div className={styles.feature}>
                    <span>🏊</span>
                    <span>Pool</span>
                  </div>
                  <div className={styles.feature}>
                    <span>🌳</span>
                    <span>Garden</span>
                  </div>
                  <div className={styles.feature}>
                    <span>🛏️</span>
                    <span>4 BHK</span>
                  </div>
                </div>
                <div className={styles.propertyFooter}>
                  <span className={styles.postedTime}>Posted 1d ago</span>
                  <button className={styles.contactBtn}>Contact Owner</button>
                </div>
              </div>
            </div>



            {/* Property Card 5 - NEW */}
            <div className={styles.propertyCard}>
              <div className={styles.propertyImageContainer}>
                <div className={styles.propertyImage}>
                  <img
                    src="https://images.unsplash.com/photo-1560184897-67f4a3f9a7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Penthouse Duplex"
                    className={styles.propertyImg}
                  />
                  <div className={styles.propertyBadgePremium}>LUXURY</div>
                  <div className={styles.propertyActions}>
                    <button className={styles.wishlistBtn}>❤️</button>
                  </div>
                </div>
              </div>
              <div className={styles.propertyInfo}>
                <div className={styles.propertyHeader}>
                  <h3 className={styles.propertyTitle}>Penthouse Duplex</h3>
                  <span className={styles.propertyPrice}>₹1,20,000<span className={styles.priceUnit}>/month</span></span>
                </div>
                <div className={styles.propertyLocation}>
                  <span>📍 Bangalore, Karnataka</span>
                  <div className={styles.propertyRating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span className={styles.ratingNumber}>4.9</span>
                  </div>
                </div>
                <div className={styles.propertyFeatures}>
                  <div className={styles.feature}>
                    <span>🛏️</span>
                    <span>4 BHK</span>
                  </div>
                  <div className={styles.feature}>
                    <span>📐</span>
                    <span>2800 sq.ft</span>
                  </div>
                  <div className={styles.feature}>
                    <span>🏊</span>
                    <span>Private Pool</span>
                  </div>
                </div>
                <div className={styles.propertyFooter}>
                  <span className={styles.postedTime}>Posted Yesterday</span>
                  <button className={styles.contactBtn}>Contact Owner</button>
                </div>
              </div>
            </div>

            {/* Property Card 6 - NEW */}
            <div className={styles.propertyCard}>
              <div className={styles.propertyImageContainer}>
                <div className={styles.propertyImage}>
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Family House"
                    className={styles.propertyImg}
                  />
                  <div className={styles.propertyBadge}>FAMILY</div>
                  <div className={styles.propertyActions}>
                    <button className={styles.wishlistBtn}>❤️</button>
                  </div>
                </div>
              </div>
              <div className={styles.propertyInfo}>
                <div className={styles.propertyHeader}>
                  <h3 className={styles.propertyTitle}>Spacious Family House</h3>
                  <span className={styles.propertyPrice}>₹45,000<span className={styles.priceUnit}>/month</span></span>
                </div>
                <div className={styles.propertyLocation}>
                  <span>📍 Chennai, Tamil Nadu</span>
                  <div className={styles.propertyRating}>
                    <span className={styles.stars}>★★★★☆</span>
                    <span className={styles.ratingNumber}>4.7</span>
                  </div>
                </div>
                <div className={styles.propertyFeatures}>
                  <div className={styles.feature}>
                    <span>🛏️</span>
                    <span>3 BHK</span>
                  </div>
                  <div className={styles.feature}>
                    <span>📐</span>
                    <span>1800 sq.ft</span>
                  </div>
                  <div className={styles.feature}>
                    <span>🌳</span>
                    <span>Large Garden</span>
                  </div>
                </div>
                <div className={styles.propertyFooter}>
                  <span className={styles.postedTime}>Posted 5h ago</span>
                  <button className={styles.contactBtn}>Contact Owner</button>
                </div>
              </div>
            </div>
            {/* Property Card 7 - Luxury Penthouse */}
            <div className={styles.propertyCard}>
              <div className={styles.propertyImageContainer}>
                <div className={styles.propertyImage}>
                  <img
                    src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Luxury Penthouse"
                    className={styles.propertyImg}
                  />
                  <div className={styles.propertyBadgePremium}>PENTHOUSE</div>
                  <div className={styles.propertyActions}>
                    <button className={styles.wishlistBtn}>❤️</button>
                  </div>
                </div>
              </div>
              <div className={styles.propertyInfo}>
                <div className={styles.propertyHeader}>
                  <h3 className={styles.propertyTitle}>Skyline Penthouse</h3>
                  <span className={styles.propertyPrice}>₹95,000<span className={styles.priceUnit}>/month</span></span>
                </div>
                <div className={styles.propertyLocation}>
                  <span>📍 Mumbai, Maharashtra</span>
                  <div className={styles.propertyRating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span className={styles.ratingNumber}>4.9</span>
                  </div>
                </div>
                <div className={styles.propertyFeatures}>
                  <div className={styles.feature}>
                    <span>🛏️</span>
                    <span>3 BHK</span>
                  </div>
                  <div className={styles.feature}>
                    <span>📐</span>
                    <span>2200 sq.ft</span>
                  </div>
                  <div className={styles.feature}>
                    <span>🏊</span>
                    <span>Infinity Pool</span>
                  </div>
                </div>
                <div className={styles.propertyFooter}>
                  <span className={styles.postedTime}>Posted 8h ago</span>
                  <button className={styles.contactBtn}>Contact Owner</button>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* AI Features Section */}
        <section className={styles.aiSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.aiIcon}>🤖</span>
              AI-Powered Home Hunting
            </h2>
            <p className={styles.sectionSubtitle}>Experience the future of property search with cutting-edge AI technology</p>
          </div>

          <div className={styles.aiFeaturesGrid}>
            <div className={styles.aiFeature}>
              <div className={styles.aiFeatureIcon}>🎭</div>
              <h3>Personality Match</h3>
              <p>Our AI analyzes your lifestyle preferences to match you with properties that fit your personality</p>
              <button className={styles.aiFeatureBtn}>Take Quiz →</button>
            </div>

            <div className={styles.aiFeature}>
              <div className={styles.aiFeatureIcon}>🔮</div>
              <h3>Price Predictor</h3>
              <p>Predict future property values based on market trends, location development, and historical data</p>
              <button className={styles.aiFeatureBtn}>View Predictions →</button>
            </div>

            <div className={styles.aiFeature}>
              <div className={styles.aiFeatureIcon}>📊</div>
              <h3>Neighborhood Score</h3>
              <p>Get detailed neighborhood analytics including safety, amenities, commute times, and community vibe</p>
              <button className={styles.aiFeatureBtn}>Explore Scores →</button>
            </div>

          </div>
        </section>

        {/* Interactive Property Filters */}
        <div className={styles.filterBar}>
          <div className={styles.filterTabs}>
            {filters.map(filter => (
              <button
                key={filter}
                className={`${styles.filterTab} ${activeFilter === filter.toLowerCase() ? styles.active : ''}`}
                onClick={() => setActiveFilter(filter.toLowerCase())}
              >
                {filter}
                {filter === 'Trending' && <span className={styles.filterBadge}>🔥</span>}
                {filter === 'Luxury' && <span className={styles.filterBadge}>💎</span>}
              </button>
            ))}
          </div>

          <div className={styles.advancedFilters}>
            <button className={styles.advFilterBtn}>
              <span>⚙️</span>
              Advanced Filters
            </button>
            <button className={styles.advFilterBtn}>
              <span>🗺️</span>
              Map View
            </button>
            <button className={styles.advFilterBtn}>
              <span>💾</span>
              Save Search
            </button>
          </div>
        </div>


        {/* Promo Banner */}
        <div className={styles.promoSection}>
          <div className={styles.promoCard}>
            <div className={styles.promoContent}>
              <div className={styles.promoBadge}>LIMITED TIME</div>
              <h2 className={styles.promoTitle}>Get 1 Month Free Rent!*</h2>
              <p className={styles.promoText}>Sign up today and get amazing deals on premium properties</p>
              <div className={styles.promoFeatures}>
                <div className={styles.promoFeature}>
                  <span>✅</span>
                  <span>No Brokerage Fees</span>
                </div>
                <div className={styles.promoFeature}>
                  <span>✅</span>
                  <span>Free Legal Assistance</span>
                </div>
                <div className={styles.promoFeature}>
                  <span>✅</span>
                  <span>Priority Support</span>
                </div>
              </div>
              <button className={styles.promoBtn}>Sign Up Now →</button>
            </div>
            <div className={styles.promoImage}>
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Special Offer"
                className={styles.promoImg}
              />
            </div>
          </div>
        </div>


        {/* Popular Locations */}
        <section className={styles.locationsSection}>
          <h2 className={styles.sectionTitle}>📍 Popular Locations</h2>
          <div className={styles.locationsGrid}>
            <div className={styles.locationCard}>
              <div className={styles.locationImage}>
                <img
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Kochi"
                  className={styles.locationImg}
                />
              </div>
              <h3 className={styles.locationTitle}>Kochi</h3>
              <p className={styles.locationCount}>850+ Properties</p>
            </div>
            <div className={styles.locationCard}>
              <div className={styles.locationImage}>
                <img
                  src="https://images.unsplash.com/photo-1580250864656-cd501faa9c76?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Napier Museum, Trivandrum"
                  className={styles.locationImg}
                />
              </div>
              <h3 className={styles.locationTitle}>Trivandrum</h3>
              <p className={styles.locationCount}>720+ Properties</p>
            </div>
            <div className={styles.locationCard}>
              <div className={styles.locationImage}>
                <img
                  src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Calicut"
                  className={styles.locationImg}
                />
              </div>
              <h3 className={styles.locationTitle}>Calicut</h3>
              <p className={styles.locationCount}>580+ Properties</p>
            </div>
            <div className={styles.locationCard}>
              <div className={styles.locationImage}>
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Chennai"
                  className={styles.locationImg}
                />
              </div>
              <h3 className={styles.locationTitle}>Chennai</h3>
              <p className={styles.locationCount}>1,200+ Properties</p>
            </div>
          </div>
        </section>

        {/* Investment Calculator */}
        <section className={styles.calculatorSection}>
          <div className={styles.calculatorCard}>
            <div className={styles.calculatorHeader}>
              <h2 className={styles.sectionTitle}>💸 Smart Investment Calculator</h2>
              <p>Calculate ROI, compare rent vs buy, and get investment insights</p>
            </div>

            <div className={styles.calculatorGrid}>
              <div className={styles.calculatorInputs}>
                <div className={styles.inputGroup}>
                  <label>Property Value</label>
                  <input type="range" min="1000000" max="50000000" step="100000" />
                  <div className={styles.inputValue}>₹25,00,000</div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Expected Rent</label>
                  <input type="range" min="5000" max="200000" step="1000" />
                  <div className={styles.inputValue}>₹35,000/month</div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Loan Amount</label>
                  <input type="range" min="0" max="100" step="1" />
                  <div className={styles.inputValue}>70%</div>
                </div>
              </div>

              <div className={styles.calculatorResults}>
                <div className={styles.resultCard}>
                  <div className={styles.resultLabel}>ROI</div>
                  <div className={styles.resultValue}>8.7%</div>
                  <div className={styles.resultSubtext}>Annual Returns</div>
                </div>

                <div className={styles.resultCard}>
                  <div className={styles.resultLabel}>Break-even</div>
                  <div className={styles.resultValue}>4.2 years</div>
                  <div className={styles.resultSubtext}>Time to Profit</div>
                </div>

                <div className={styles.resultCard}>
                  <div className={styles.resultLabel}>Cash Flow</div>
                  <div className={styles.resultValue}>+₹12,500</div>
                  <div className={styles.resultSubtext}>Monthly Positive</div>
                </div>

                <button className={styles.detailedAnalysisBtn}>📊 Get Detailed Analysis →</button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Why Choose HomeHunt?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Verified"
                  className={styles.featureImg}
                />
              </div>
              <h3 className={styles.featureTitle}>Verified Listings</h3>
              <p className={styles.featureDesc}>Every property is personally verified by our team</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="No Brokerage"
                  className={styles.featureImg}
                />
              </div>
              <h3 className={styles.featureTitle}>Zero Brokerage</h3>
              <p className={styles.featureDesc}>Connect directly with owners, save thousands</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Virtual Tours"
                  className={styles.featureImg}
                />
              </div>
              <h3 className={styles.featureTitle}>Virtual Tours</h3>
              <p className={styles.featureDesc}>360° virtual tours for remote viewing</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Legal Support"
                  className={styles.featureImg}
                />
              </div>
              <h3 className={styles.featureTitle}>Legal Support</h3>
              <p className={styles.featureDesc}>Free legal consultation for property transactions</p>
            </div>
          </div>
        </section>

        {/* Community & Social Proof */}
        <section className={styles.communitySection}>
          <div className={styles.communityHeader}>
            <h2 className={styles.sectionTitle}>👥 Live Community Activity</h2>
            <div className={styles.communityStats}>
              <span className={styles.communityStat}>🔴 142 users viewing now</span>
              <span className={styles.communityStat}>💬 48 active chats</span>
              <span className={styles.communityStat}>📝 12 tours scheduled today</span>
            </div>
          </div>

          <div className={styles.activityFeed}>
            <div className={styles.activityCard}>
              <div className={styles.activityAvatar}>
                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="Priya Sharma"
                  className={styles.authorImg}
                />              </div>
              <div className={styles.activityContent}>
                <p><strong>Priya Sharma</strong> just booked a viewing for <strong>Sky Garden Apartments</strong></p>
                <span className={styles.activityTime}>2 minutes ago</span>
              </div>
            </div>

            <div className={styles.activityCard}>
              <div className={styles.activityAvatar}>
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User" />
              </div>
              <div className={styles.activityContent}>
                <p><strong>Amit Patel</strong> found their dream home through AI matching!</p>
                <span className={styles.activityTime}>15 minutes ago</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.testimonialsSection}>
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"Found my dream apartment within 3 days! The process was smooth and transparent. Saved ₹60,000 in brokerage!"</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Sarah Mathew"
                    className={styles.authorImg}
                  />
                </div>
                <div className={styles.authorInfo}>
                  <h4>Sarah Mathew</h4>
                  <p>Software Engineer, Kochi</p>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"Excellent service! The team helped me negotiate a great deal. Found my perfect villa within budget."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Rahul Kumar"
                    className={styles.authorImg}
                  />
                </div>
                <div className={styles.authorInfo}>
                  <h4>Rahul Kumar</h4>
                  <p>Business Owner, Trivandrum</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Promotion */}
        <section className={styles.appPromo}>
          <div className={styles.appContent}>
            <div className={styles.appText}>
              <h2 className={styles.appTitle}>📱 Experience HomeHunt AR</h2>
              <p className={styles.appSubtitle}>Use your phone to view properties in Augmented Reality. Walk through homes before visiting!</p>
              <div className={styles.appFeatures}>
                <div className={styles.appFeature}>
                  <span>🎯</span>
                  <span>AR Property Tours</span>
                </div>
                <div className={styles.appFeature}>
                  <span>📸</span>
                  <span>Live Video Calls</span>
                </div>
                <div className={styles.appFeature}>
                  <span>🔔</span>
                  <span>Instant Notifications</span>
                </div>
              </div>
              <div className={styles.appButtons}>
                <button className={styles.appStoreBtn}>
                  <span className={styles.storeIcon}>⬇️</span>
                  App Store
                </button>
                <button className={styles.playStoreBtn}>
                  <span className={styles.storeIcon}>⬇️</span>
                  Play Store
                </button>
              </div>
            </div>
            <div className={styles.appMockup}>
              <div className={styles.mockupScreen}>
                <img
                  src="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="App Preview"
                />
              </div>
            </div>
          </div>
        </section>



      </main>
    </div>
  );
};

export default Dashboard;