import { useEffect, useMemo, useState } from "react";
import heroImage from "../Images/trandia-kurta-sets-image.webp";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createEvent, featchSimilarProduct } from "../service/api";
import ProductItem from "../Components/ProductItem";
import { Home } from "lucide-react";

const formatMoney = (value) => {
  if (typeof value !== "number") return "";

  const converted = value * 100;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
};

const getImageSrc = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.src || "";
};

const extractDescriptionDetails = (description = "") => {
  const details = {};

  let text = description
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/:\s*:/g, " ")
    .replace(/\s*:\s*/g, ": ")
    .trim();

  const keys = [
    "Fabric",
    "Color",
    "Work",
    "Length",
    "Wash Care",
    "Wash & Care",
    "Shape",
    "Style",
    "Weight",
  ];

  // Extract details
  keys.forEach((key) => {
    const regex = new RegExp(`${key}:\\s*([^:]+)`, "i");
    const match = text.match(regex);

    if (match) {
      details[key.toLowerCase()] = match[1].trim();
    }
  });

  // Remove extracted parts from text
  keys.forEach((key) => {
    const regex = new RegExp(`${key}:\\s*([^:]+)`, "gi");
    text = text.replace(regex, "");
  });

  // ✅ FINAL CLEAN PARAGRAPH
  const cleanText = text
    .replace(/Details/gi, "") // remove "Details"
    .replace(/Pack Contains/gi, "Pack Contains:")
    .replace(/\s+/g, " ")
    .trim();

  return {
    details,
    remaining: cleanText, // 👈 single string now
  };
};

const ImageGallery = ({ images, productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateViewport = () => setIsDesktop(window.innerWidth >= 1024);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const galleryImages = images && images.length ? images : [{ url: heroImage }];
  const activeImage = galleryImages[activeIndex] || galleryImages[0];

  return (
    <div>
      <div
        className="t4s-product-img t4s_ratio t4s-oh"
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#f7f7f7",
          aspectRatio: "4 / 5",
          position: "relative",
        }}
        onMouseEnter={() => isDesktop && setIsZoomed(true)}
        onMouseLeave={() => isDesktop && setIsZoomed(false)}
      >
        <img
          src={getImageSrc(activeImage)}
          alt={productName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.35s ease",
            transform: isZoomed ? "scale(1.08)" : "scale(1)",
          }}
        />
      </div>

      <div
        className="t4s-d-flex t4s-flex-wrap"
        style={{ gap: "10px", marginTop: "14px" }}
      >
        {galleryImages.map((image, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={`${getImageSrc(image)}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="t4s-swatch__item"
              aria-pressed={isActive}
              style={{
                padding: 0,
                borderRadius: "8px",
                overflow: "hidden",
                border: isActive ? "2px solid #111" : "1px solid #d7d7d7",
                width: "70px",
                height: "70px",
                background: "#fff",
              }}
            >
              <img
                src={getImageSrc(image)}
                alt={`${productName} thumbnail ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ProductInfo = ({ product }) => {
  const handleEvents = async (eventType) => {
    const userId = localStorage.getItem("user_id");
    const sessionId = sessionStorage.getItem("session_id");
    const payload = {
      userId: userId || null,
      shopifyStoreID: window?.shopifyStoreID || "shopify",
      sessionId: sessionId || null,
      eventType: eventType,
      page: window.location.pathname,
      product: {
        productId: product?.productId,
        name: product?.name,
        price: product?.price,
        brand: product?.brand,
        variantId: product?.variants?.[0]?.variantId?.split("/").pop(),
      },
    };
    await createEvent(payload);
    if (eventType === "add_to_cart") {
      toast.success(`${payload.product.name} has been added to the cart`);
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
    } else if (eventType === "add_to_wishlist") {
      toast.success(`${payload.product.name} has been added to your wishlist`);
    } else if (eventType === "view_product") {
      toast.success(`You are viewing ${payload.product.name}`);
    }
  };
  const [selectedAttributes, setSelectedAttributes] = useState(() => {
    const initial = {};

    Object.entries(product.attributes || {}).forEach(([key, values]) => {
      if (values === null) return;

      if (Array.isArray(values) && values.length) {
        initial[key] = values[0];
      } else if (typeof values === "string" && values.trim() !== "") {
        initial[key] = values;
      }
    });

    return initial;
  });

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : null;

  const handleSelect = (attribute, value) => {
    setSelectedAttributes((prev) => ({ ...prev, [attribute]: value }));
  };

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            fontSize: "13px",
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          {product.category}
        </div>
        <h1 style={{ fontSize: "30px", fontWeight: 700, marginTop: "6px" }}>
          {product.name}
        </h1>
        <div style={{ fontSize: "14px", color: "#777", marginTop: "6px" }}>
          By {product.brand || product.vendor}
        </div>
      </div>

      <div
        className="t4s-d-flex t4s-align-items-center t4s-flex-wrap"
        style={{ gap: "10px", marginBottom: "18px" }}
      >
        <span style={{ fontSize: "24px", fontWeight: 700 }}>
          {formatMoney(product.price)}
        </span>
        {product.compareAtPrice ? (
          <span
            style={{
              textDecoration: "line-through",
              color: "#9a9a9a",
              fontSize: "15px",
            }}
          >
            {formatMoney(product.compareAtPrice)}
          </span>
        ) : null}
        {discountPercent ? (
          <span
            style={{
              background: "#111",
              color: "#fff",
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "999px",
              fontWeight: 600,
            }}
          >
            {discountPercent}% off
          </span>
        ) : null}
      </div>

      <div style={{ marginBottom: "16px", fontSize: "14px" }}>
        <span style={{ fontWeight: 600, marginRight: "6px" }}>
          Availability:
        </span>
        <span
          style={{
            color: product.isAvailable ? "#1a7f37" : "#b42318",
            fontWeight: 600,
          }}
        >
          {product.isAvailable ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div style={{ marginBottom: "24px" }}>
        {Object.entries(product.attributes || {})
          .filter(([_, values]) => {
            if (values === null) return false; // ❌ remove null

            if (Array.isArray(values)) {
              return (
                values.length > 0 && values.some((v) => v !== null && v !== "")
              );
            }

            return typeof values === "string" && values.trim() !== "";
          })
          .map(([attribute, values]) => (
            <div className="t4s-swatch" key={attribute}>
              <div className="t4s-swatch__option is--first-color">
                <div className="t4s-swatch__title">{attribute}</div>
                <div className="t4s-swatch__list">
                  {(Array.isArray(values) ? values : [values])
                    .filter((v) => v !== null && v !== "")
                    .map((value) => (
                      <button
                        key={`${attribute}-${value}`}
                        type="button"
                        className={`t4s-swatch__item ${
                          selectedAttributes[attribute] === value
                            ? "is--selected"
                            : ""
                        }`}
                        onClick={() => handleSelect(attribute, value)}
                      >
                        {value}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ))}
      </div>

      <div
        className="t4s-d-flex t4s-flex-wrap t4s-justify-content-center"
        style={{ gap: "12px", marginBottom: "12px" }}
      >
        <button
          onClick={() => {
            handleEvents("add_to_cart");
          }}
          type="button"
          className="t4s-btn"
          style={{ minWidth: "180px" }}
        >
          Add to Cart
        </button>
        <button
          onClick={() => handleEvents("add_to_wishlist")}
          type="button"
          className="t4s-btn"
          style={{
            minWidth: "180px",
            background: "transparent",
            color: "#111",
            borderColor: "#d0d0d0",
          }}
        >
          Wishlist
        </button>
      </div>
    </div>
  );
};

const DescriptionAccordion = ({ description }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { details, remaining } = useMemo(
    () => extractDescriptionDetails(description),
    [description],
  );

  return (
    <div style={{ borderTop: "1px solid #e6e6e6", marginTop: "24px" }}>
      <button
        type="button"
        className="t4s-d-flex t4s-justify-content-between t4s-align-items-center"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          padding: "16px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "16px",
        }}
      >
        <span>Description</span>
        <span style={{ fontSize: "18px" }}>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div style={{ paddingBottom: "12px" }}>
          {/* ✅ Single Clean Paragraph */}
          <p style={{ marginBottom: "10px", color: "#4b4b4b" }}>{remaining}</p>

          {/* ✅ Structured Details */}
          <div
            className="t4s-row t4s-gx-10 t4s-gy-10"
            style={{ marginTop: "12px" }}
          >
            {[
              ["Fabric", details.fabric],
              ["Color", details.color],
              ["Work", details.work],
              ["Length", details.length],
              ["Wash Care", details["wash care"] || details["wash & care"]],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div className="t4s-col-item t4s-col-6" key={label}>
                  <div
                    style={{
                      background: "#f7f7f7",
                      borderRadius: "10px",
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        textTransform: "uppercase",
                        color: "#777",
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontWeight: 600 }}>{value}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RecommendedProducts = ({ product }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product?.productId) return;

    const fetchRecommended = async () => {
      const userId = localStorage.getItem("user_id");
      setLoading(true);

      try {
        const res = await featchSimilarProduct(product.productId, userId);
        setRecommendations(res?.data || []);
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          "Fetch Similar Product Error";

        console.log(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [product?.productId]);

  const renderSkeletonItems = () => {
    const skeletonCount = 6; // you can adjust (4–8 looks good for horizontal scroll)

    return Array.from({ length: skeletonCount }, (_, index) => (
      <div key={`skeleton-${index}`} style={{ minWidth: "220px" }}>
        <ProductItem loadingData={true} />
      </div>
    ));
  };

  if (!recommendations.length) return null;

  return (
    <div style={{ marginTop: "40px" }}>
      <div
        className="t4s-d-flex t4s-justify-content-between t4s-align-items-center"
        style={{ marginBottom: "16px" }}
      >
        <h3 style={{ fontSize: "22px", fontWeight: 700 }}>You May Also Like</h3>
      </div>

      <div
        className="t4s-d-flex t4s-flex-nowrap"
        style={{
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      >
        {loading ? (
          renderSkeletonItems()
        ) : recommendations.length === 0 ? (
          <div>No recommendations available.</div>
        ) : (
          recommendations.map((item) => (
            <div
              key={item._id || item.productId}
              style={{
                minWidth: "220px",
                maxWidth: "220px",
                height: "100%", 
                display: "flex",
              }}
            >
              <ProductItem product={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const location = useLocation();
  const product = location.state?.product;
  const navigate = useNavigate();
  return (
    <div className="t4s-container" style={{ padding: "30px 0 60px" }}>
      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#555",
            fontSize: "14px",
          }}
        >
          <Home size={18} />
          <span>Home</span>
        </button>
      </div>
      <div className="t4s-row t4s-gx-20 t4s-gy-20">
        <div className="t4s-col-item t4s-col-12 t4s-col-md-6">
          <ImageGallery images={product.images} productName={product.name} />
        </div>
        <div className="t4s-col-item t4s-col-12 t4s-col-md-6">
          <ProductInfo product={product} />
          <DescriptionAccordion description={product.description} />
        </div>
      </div>
      <RecommendedProducts product={product} />
    </div>
  );
};

export default ProductDetailPage;
