import React, { useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import parse from 'html-react-parser';

const ProductItem = ({ product }) => {
  const [addToCart, setAddToCart] = useState(false)
  const handleImageClick = (product) => {
    window.location.href = `${product.productUrl}`;
  };

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

  const handleAddToCart = () => {
    setAddToCart(true)
  }
  console.log(product,"product")
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
                src={`${product?.imageUrl}?width=268&height=403`}
                alt={product.name}
                className="t4s-product-main-img lazyautosizes lazyloadt4sed"
              />
              <img
                src={`${product?.images?.[1]?.url}?width=268&height=403`}
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
              {/* <a
              href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")}
              data-id={product.productId}
              className="t4s-pr-item-btn t4s-pr-addtocart t4s-tooltip-actived"
              rel="nofollow"
            > */}
              <a href="#" className="t4s-pr-item-btn t4s-pr-addtocart t4s-tooltip-actived">
                <span className="t4s-text-pr" onClick={e => {
                  e.preventDefault();
                  handleAddToCart();
                }}>Quick Shop</span>
              </a>
              {/* </a> */}
            </div>

            <div className="t4s-product-btns2">
              <a
                href="/collections/all-mens/products/mens-kurta-1019-at-011090-gren?_pos=1&_fid=d9fa77533&_ss=c"
                data-tooltip="left"
                data-id="4711651278937"
                rel="nofollow"
                className="t4s-pr-item-btn t4s-pr-wishlist t4s-tooltip-actived"
                data-action-wishlist=""
                aria-describedby="tooltipt4s146155"
              >
                <span className="t4s-svg-pr-icon">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 9C21 12.75 15.72 17.98 12.59 20.53C12.24 20.81 11.75 20.82 11.4 20.55C8.27 18.15 3 13.12 3 9C3 2 12 2 12 8C12 2 21 2 21 9Z"
                      fill="none"
                      stroke="#000000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="t4s-text-pr">Add to Wishlist</span>
              </a>


              <a
                href={`/collections/all-mens/products/mens-kurta-1019-at-011090-gren?_pos=1&_fid=d9fa77533&_ss=c`}
                data-tooltip="left"
                data-id="4711651278937"
                rel="nofollow"
                className="t4s-pr-item-btn t4s-pr-quickview t4s-tooltip-actived"
                data-action-quickview=""
                aria-describedby="tooltipt4s201326"
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
      {
        addToCart &&
        <div className="t4s-modal t4s-modal--is-active t4s-opening-qs" aria-hidden="false" tabIndex={-1} role="dialog">
          <div className="t4s-modal__inner">
            <div className="t4s-modal__content">
              <div className="t4s-product-quick-shop initProducts__enabled">
                <div className="t4s-product-qs-inner">
                  <h1 className="t4s-product-qs__title" >
                    <a href="#">
                      {product.name}
                    </a>
                  </h1>

                  <div className="t4s-product-qs__price" style={{ fontSize: "24px", fontWeight: 400, color: "#4f4f4f" }}>
                    <div className="custom-price-container">
                      <div className="custom-money-price">
                        <ins><span className="money">{parse(get_currency(product.price))}</span></ins>
                        <span className="t4s-badge-price">{Math.round(((product?.compareAtPrice - product?.price) / product?.compareAtPrice) * 100)}% Off</span>
                      </div>
                      <div className="custom-compare-price">
                        <del><span className="money">{parse(get_currency(product.compareAtPrice))}</span></del>
                      </div>
                    </div>
                  </div>

                  <form method="post" action="/cart/add" className="t4s-form__product" encType="multipart/form-data">
                    <select name="id" className="t4s-product__select t4s-d-none">
                      <option value="40296450916547">36 (Small)</option>
                      <option value="40296450949315">38 (Medium)</option>
                      <option value="40296450982083">40 (Large)</option>
                      <option value="40296451014851">42 (X-Large)</option>
                    </select>

                    <div className="t4s-swatch t4s-color-mode__variant_image t4s-selector-mode__circle">
                      <div className="t4s-swatch__option is-t4s-name__size">
                        <h4 className="t4s-swatch__title">
                          Size: <span className="t4s-swatch__current">Choose an option</span>
                        </h4>
                        <div className="t4s-swatch__list">
                         
                            <div className="t4s-swatch__item" data-value={product?.attributes?.size}>{product?.attributes?.size}</div>
                        
                        </div>
                      </div>
                    </div>

                    <div className="t4s-product-form__buttons">
                      <div className="t4s-d-flex">
                        <div className="t4s-quantity-wrapper t4s-product-form__qty">
                          <button type="button" className="t4s-quantity-selector is--minus">-</button>
                          <input
                            type="number"
                            name="quantity"
                            defaultValue={1}
                            min={1}
                            className="t4s-quantity-input"
                          />
                          <button type="button" className="t4s-quantity-selector is--plus">+</button>
                        </div>

                        <a
                          href="/products/mens-golden-brocade-jacquard-sherwani-set"
                          className="t4s-product-form__btn t4s-pr-wishlist"
                          rel="nofollow"
                        >
                          <span className="t4s-svg-pr-icon">
                            <svg viewBox="0 0 24 24"><use xlinkHref="#t4s-icon-wis" /></svg>
                          </span>
                          <span className="t4s-text-pr">Add to Wishlist</span>
                        </a>

                        <button type="submit" className="t4s-product-form__submit t4s-btn">
                          <span className="t4s-btn-atc_text">Add to cart</span>
                          <span className="t4s-loading__spinner" hidden>
                            <svg width="16" height="16" className="t4s-svg-spinner" viewBox="0 0 66 66">
                              <circle className="t4s-path" fill="none" strokeWidth="6" cx="33" cy="33" r="30" />
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>

                    <input type="hidden" name="product-id" value="6816035471555" />
                    <input type="hidden" name="section-id" value="template--17869496877251__main-qs" />
                  </form>
                </div>
              </div>
            </div>
            <button onClick={() => setAddToCart(false)} data-t4s-modal-close="" title="Close" type="button" class="t4s-modal-close">
              <svg class="t4s-modal-icon-close" role="presentation" viewBox="0 0 16 14"><path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path></svg>
            </button>
          </div>
        </div>
      }
    </>
  );

};

export default ProductItem;