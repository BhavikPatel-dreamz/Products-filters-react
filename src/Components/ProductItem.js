import React, { useState } from "react";
import 'react-lazy-load-image-component/src/effects/blur.css';
import parse from 'html-react-parser';

const ProductItem = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const handleImageClick = (product) => {
    window.location.href = `${product.productUrl}`;
  };

  function get_currency(price) {
    const rate = window.Shopify?.currency?.rate || 1;
    const formatMoney = window.BOLD?.common?.Shopify?.formatMoney;
    const currency = window?.BOLD?.common?.Shopify?.cart?.currency
    if (typeof formatMoney !== 'function') {
      console.warn('formatMoney function is not available.');
      return ((price * 100) * rate).toFixed(2);
    }
    return `${formatMoney((price * 100) * rate)} ${currency}`;
  }


  const addToCart = (variant) => {

    if (typeof window?.addCart !== "function") {
      return null
    }
    else {
      setLoading(true);
      return window?.addCart(variant)
    }
  }

  // Generate the price HTML string
  const getPriceHTML = () => {
    let html = '<span class="price dib mb__5">';
    if (product.compareAtPrice) {
      html += `<del>${get_currency(product.compareAtPrice)}</del>`;
    }
    html += `<ins>${get_currency(product.price)}</ins>`;
    html += '</span>';

    return html;
  };

  return (
    <>
      <div className="t4s-product t4s-pr-grid t4s-pr-style3 t4s-pr-6716638691523 t4s-col-item is-t4s-pr-created">
        <div className="t4s-product-wrapper">
          <div data-cacl-slide className="t4s-product-inner t4s-pr t4s-oh">
            <div
              className="t4s-product-img t4s_ratio is-show-img2"
              data-style="--aspect-ratioapt: 0.75"
              onClick={() => handleImageClick(product)}
            >
              <img
                src={`${product?.imageUrl}?width=350&height=452`}
                alt={product.name}
                className="t4s-product-main-img lazyautosizes lazyloadt4sed"
              />
              <img
                src={`${product?.images?.[1]?.url}?width=350&height=452`}
                alt={product?.name}
                className="t4s-product-hover-img lazyautosizes lazyloadt4sed"
              />
            </div>
              
            {product?.compareAtPrice && (
              <div className="t4s-product-badge">
                <span className="t4s-badge-item t4s-badge-sale">
                  -{Math.round(((product?.compareAtPrice - product?.price) / product?.compareAtPrice) * 100)}%
                </span>
              </div>
            )}

            <div className="custom-atc-grid t4s-product-btns">
            {(product.variants.length ==1) ? 

              <button
                data-animation-atc='{"ani":"none","time":3000}'
                type="submit"
                name="add"
                style={{ display: "flex", gap: "5px" }}
                className="custom-atc-grid t4s-product-form__submit t4s-btn t4s-btn-base t4s-btn-style- t4s-btn-color- t4s-w-100 t4s-justify-content-center t4s-btn-loading__svg"
                onClick={() => addToCart(product.variants[0].variantId.split("/").pop())}
              >
                <span className="custom-atc-grid t4s-loading__spinner" style={{ display: loading ? "block" : "none" }}>
                  <svg
                    width="16"
                    height="16"
                    className="t4s-svg-spinner"
                    focusable="false"
                    role="presentation"
                    viewBox="0 0 66 66"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="t4s-path"
                      fill="none"
                      strokeWidth="6"
                      cx="33"
                      cy="33"
                      r="30"
                    />
                  </svg>
                </span>
                <span className="custom-atc-grid t4s-btn-atc_text">Add to Cart</span>
              </button>

              :

               <>
                
                <a
                href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")}
                data-tooltip="left"
                data-id={product.variants[0].variantId.split('/').pop()}
                rel="nofollow"
                className="t4s-pr-item-btn t4s-pr-quickview t4s-tooltip-actived"
                data-action-quickview=""
                aria-describedby=""
              >
                <span className="custom-atc-grid t4s-loading__spinner" style={{ display: loading ? "block" : "none" }}>
                  <svg
                    width="16"
                    height="16"
                    className="t4s-svg-spinner"
                    focusable="false"
                    role="presentation"
                    viewBox="0 0 66 66"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="t4s-path"
                      fill="none"
                      strokeWidth="6"
                      cx="33"
                      cy="33"
                      r="30"
                    />
                  </svg>
                </span>
                <span className="custom-atc-grid t4s-btn-atc_text">Add to Cart</span>
              </a>           
                
                </> }


                </div><div className="t4s-product-btns2">
                    <a
                      href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")}
                      data-tooltip="left"
                      // data-id={product.variants[0].variantId.split('/').pop()}
                      data-id={product.productId}
                      rel="nofollow"
                      className={`t4s-pr-item-btn t4s-pr-wishlist t4s-tooltip-actived`}
                      data-action-wishlist=""
                      aria-describedby=""
                    >
                      <span className="t4s-svg-pr-icon">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.0213 2.94287C8.91509 2.94287 7.94652 3.41859 7.34277 4.22269C6.73902 3.41859 5.77045 2.94287 4.6642 2.94287C3.78361 2.94386 2.93937 3.29412 2.31669 3.91679C1.69402 4.53946 1.34377 5.38371 1.34277 6.2643C1.34277 10.0143 6.90295 13.0497 7.13974 13.175C7.20215 13.2086 7.27191 13.2262 7.34277 13.2262C7.41364 13.2262 7.4834 13.2086 7.54581 13.175C7.78259 13.0497 13.3428 10.0143 13.3428 6.2643C13.3418 5.38371 12.9915 4.53946 12.3689 3.91679C11.7462 3.29412 10.9019 2.94386 10.0213 2.94287ZM7.34277 12.3072C6.36456 11.7372 2.19992 9.14055 2.19992 6.2643C2.20077 5.61099 2.46067 4.98468 2.92263 4.52273C3.38459 4.06077 4.01089 3.80086 4.6642 3.80001C5.70617 3.80001 6.58099 4.35501 6.94634 5.24644C6.97863 5.32505 7.03356 5.39228 7.10415 5.43959C7.17474 5.48691 7.2578 5.51217 7.34277 5.51217C7.42775 5.51217 7.51081 5.48691 7.5814 5.43959C7.65199 5.39228 7.70691 5.32505 7.7392 5.24644C8.10456 4.35341 8.97938 3.80001 10.0213 3.80001C10.6747 3.80086 11.301 4.06077 11.7629 4.52273C12.2249 4.98468 12.4848 5.61099 12.4856 6.2643C12.4856 9.13626 8.31992 11.7366 7.34277 12.3072Z" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="t4s-text-pr">
                        Add to Wishlist
                      </span>
                    </a>


                    <a
                      href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")}
                      data-tooltip="left"
                      data-id={product.variants[0].variantId.split('/').pop()}
                      rel="nofollow"
                      className="t4s-pr-item-btn t4s-pr-quickview t4s-tooltip-actived"
                      data-action-quickview=""
                      aria-describedby=""
                    >
                      <span className="t4s-svg-pr-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#000000" strokeWidth="2" fill="none" />
                          <circle cx="12" cy="12" r="3" stroke="#000000" strokeWidth="2" fill="none" />
                        </svg>
                      </span>
                      <span className="t4s-text-pr">Quick view</span>
                    </a>
                  </div>
          </div>

          <div className="t4s-product-info">
            <div className="t4s-product-info__inner">
              <div className="t4s-product-vendor">
                <a href="#">{product.brand}</a>
              </div>

              <h3 className="t4s-product-title">
                <a
                  href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")}
                  className="is--href-replaced"
                >
                  {product.name}
                </a>
              </h3>

              <div className="t4s-product-price">
                {parse(getPriceHTML())}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default ProductItem;