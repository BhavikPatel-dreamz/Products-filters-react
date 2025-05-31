import React from "react";
import 'react-lazy-load-image-component/src/effects/blur.css';
import parse from 'html-react-parser';

const ProductItem = ({ product }) => {
  const handleImageClick = (product) => {
    window.location.href = `${product.productUrl}`;
  };

  console.log(product)
  function get_currency(price) {
    const rate = window.Shopify?.currency?.rate || 1;
    const formatMoney = window.BOLD?.common?.Shopify?.formatMoney;

    if (typeof formatMoney !== 'function') {
      console.warn('formatMoney function is not available.');
      return ((price * 100) * rate).toFixed(2);
    }

    return formatMoney((price * 100) * rate);
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

  function isIdInLocalStorage(id) {
    const key = 't4s_wis';
    const data = localStorage.getItem(key);

    if (!data) return false;

    // Convert "id:7553802535107,id:7553802666179" into array of IDs
    const ids = data.split(',').map(item => item.replace('id:', '').trim());

    return ids.includes(String(id));
  }

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

            <div className="t4s-product-btns">
              <button
                data-animation-atc='{"ani":"none","time":3000}'
                id="add-to-cart"
                type="submit"
                name="add"
                className="t4s-product-form__submit t4s-btn t4s-btn-base t4s-btn-style- t4s-btn-color- t4s-w-100 t4s-justify-content-center t4s-btn-loading__svg"
                data-id={product.variants[0].variantId}
              >
                <span className="t4s-btn-atc_text">Add to Cart</span>
                <span className="t4s-loading__spinner" hidden>
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
              </button>

            </div>

            <div className="t4s-product-btns2">
              <a
                href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")}
                data-tooltip="left"
                data-id={product.productId}
                rel="nofollow"
                className={`t4s-pr-item-btn t4s-pr-wishlist ${isIdInLocalStorage(product.productId) ? 't4s-tooltip-actived' : ''
                  }`}
                data-action-wishlist=""
                aria-describedby=""
              >
                <span className="t4s-svg-pr-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 9C21 12.75 15.72 17.98 12.59 20.53C12.24 20.81 11.75 20.82 11.4 20.55C8.27 18.15 3 13.12 3 9C3 2 12 2 12 8C12 2 21 2 21 9Z"
                      fill={isIdInLocalStorage(product.productId) ? "#ff0000" : "none"}
                      stroke="#000000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="t4s-text-pr">
                  Add to Wishlist
                </span>
              </a>


              <a
                href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")}
                data-tooltip="left"
                data-id={product.variants[0].variantId}
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

            <a
              href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")}
              className="t4s-full-width-link is--href-replaced"
            />
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