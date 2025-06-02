import React from 'react';

const ProductCardSkeleton = () => {
    return (
        <div className="t4s-product t4s-pr-grid t4s-pr-style3 t4s-col-item">
            <div className="t4s-product-wrapper">
                <div className="t4s-product-inner t4s-pr t4s-oh">
                    {/* Product Image Skeleton */}
                    <div
                        className="t4s-product-img t4s_ratio"
                        style={{ aspectRatio: '0.75' }}
                    >
                        <div className="skeleton-image main-image"></div>
                        <div className="skeleton-image hover-image"></div>
                    </div>

                    {/* Action Buttons Skeleton */}
                    <div className="t4s-product-btns">
                        <div className="skeleton-button add-to-cart-btn"></div>
                    </div>
                    
                    {/* Badge Skeleton */}
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div className="t4s-product-badge">
                            <span className="skeleton-badge"></span>
                        </div>
                    </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="t4s-product-info">
                    <div className="t4s-product-info__inner">
                        <div className="t4s-product-vendor">
                            <div className="skeleton-text skeleton-brand"></div>
                        </div>

                        <h3 className="t4s-product-title">
                            <div className="skeleton-text skeleton-title-line-1"></div>
                            <div className="skeleton-text skeleton-title-line-2"></div>
                        </h3>

                        <div className="t4s-product-price">
                            <div className="skeleton-text skeleton-price"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .skeleton-image {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .skeleton-image.main-image {
          z-index: 1;
        }

        .skeleton-image.hover-image {
          z-index: 0;
          opacity: 0.5;
        }

        .skeleton-badge {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 12px;
          width: 45px;
          height: 24px;
          display: block;
        }

        .skeleton-button {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          width: 100%;
          height: 44px;
          display: block;
        }

        .skeleton-icon-button {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          width: 40px;
          height: 40px;
          display: inline-block;
          margin-right: 15px;
        }

        .skeleton-text {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          height: 16px;
          margin-bottom: 8px;
          display: block;
        }

        .skeleton-brand {
          width: 60%;
          height: 14px;
        }

        .skeleton-title-line-1 {
          width: 90%;
          height: 18px;
          margin-bottom: 6px;
        }

        .skeleton-title-line-2 {
          width: 70%;
          height: 18px;
          margin-bottom: 0;
        }

        .skeleton-price {
          width: 50%;
          height: 20px;
          margin-top: 8px;
          margin-bottom: 0;
        }

        @keyframes loading {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Container styles to match original with proper spacing */
        .t4s-product {
          position: relative;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          max-width: 300px;
          margin: 16px auto;
          box-sizing: border-box;
       
        }

        .t4s-product-wrapper {
          padding: 0;
          height: 100%;
        }

        .t4s-product-inner {
          position: relative;
          height: 300px;
        }

        .t4s-product-img {
          position: relative;
          overflow: hidden;
          background: #f9f9f9;
          height: 100%;
          width: 100%;
        }

        .t4s-product-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
        }

        .t4s-product-btns {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 2;
          opacity: 0.7;
        }

        .t4s-product-btns2 {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0.7;
        }

        .t4s-product-info {
          padding: 16px;
          background: white;
          min-height: 120px;
          box-sizing: border-box;
        }

        .t4s-product-info__inner {
          display: flex;
          flex-direction: column;
          gap: 8px;
          height: 100%;
        }

        .t4s-product-vendor {
          font-size: 12px;
          opacity: 0.7;
          height: 14px;
        }

        .t4s-product-title {
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.3;
          height: 48px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .t4s-product-price {
          font-weight: 600;
          font-size: 18px;
          height: 20px;
          margin-top: auto;
        }

        /* Demo container to show multiple skeletons */
        .skeleton-demo {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
        </div>
    );
};

export default ProductCardSkeleton;