import React from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ProductCard = ({ product, loading, handleImageClick }) => {
    return (
        <div className="product-inner pr">
            <div className="product-image pr oh lazyloadt4sed">
                {loading ? (
                    <div className="skeleton" style={{ height: "300px", width: "100%" }} />
                ) : (
                    <>
                        <span className="tc nt_labels pa pe_none cw">
                            <span className="onsale nt_label">
                                <span>
                                    - {product.compareAtPrice
                                        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
                                        : 0}%
                                </span>
                            </span>
                        </span>
                        <div
                            className="product-image-wrapper"
                            onClick={() => handleImageClick(product)}
                        >
                            <LazyLoadImage
                                src={product.imageUrl}
                                alt={product.name}
                                className="main-img"
                                effect="blur"
                                loading="lazy"
                                style={{ height: "403px" }}
                                placeholder={<div className="skeleton" style={{ height: "403px" }} />}
                            />
                            <img
                                src={product.images?.[1]?.url || product.imageUrl}
                                alt={product.name}
                                className="hover-img"
                                style={{ height: "403px" }}
                            />
                        </div>
                        <div className="nt_add_w ts__03 pa">
                            <button type="button" className="wishlistadd cb chp ttip_nt tooltip_right">
                                <span className="tt_txt">Add to Wishlist</span>
                                <i className="fa-regular fa-heart" />
                            </button>
                        </div>
                        <div className="hover_button op__0 tc pa flex column ts__03 des_btns_pr_1 has_sizelistt4_true">
                            <a 
                                href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")} 
                                data-id={product.productId} 
                                className="pr pr_atc cd br__40 bgw tc dib js__qs cb chp ttip_nt tooltip_top_left" 
                                rel="nofollow"
                            >
                                <span className="tt_txt">Quick Shop</span>
                                <i className="fa-solid fa-cart-shopping" />
                                <span>Quick Shop</span>
                            </a>
                        </div>
                        <div className="product-attr pa ts__03 cw op__0 tc pe_none">
                            <p className="truncate mg__0 w__100">{product.sizes}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="product-info mt__15">
                {loading ? (
                    <>
                        <div className="skeleton" style={{ height: "16px", width: "50%", marginBottom: "10px" }} />
                        <div className="skeleton" style={{ height: "16px", width: "70%", marginBottom: "10px" }} />
                        <div className="skeleton" style={{ height: "16px", width: "40%" }} />
                    </>
                ) : (
                    <>
                        <div className="product-brand">
                            <a className="cg chp" href="#">{product.brand}</a>
                        </div>
                        <h3 className="product-title pr fs__14 mg__0 fwm">
                            <a className="cd chp" href="#">{product.name}</a>
                        </h3>
                        <div className="yotpo-widget-instance" data-yotpo-product-id={product.id} />
                        <span className="price dib mb__5">
                            <del>Rs.{product.compareAtPrice}</del>
                            <ins>Rs.{product.price}</ins>
                        </span>
                        <div className="shopify-product-reviews-badge star-rating" data-id={product.id} />
                    </>
                )}
            </div>

            {!loading && (
                <div className="swatch__list_js swatch__list lh__1 nt_swatches_on_grid lazyloadt4sed">
                    <span className="nt_swatch_on_bg swatch__list--item pr ttip_nt tooltip_top_right">
                        <span className="tt_txt">{product.attributes?.color}</span>
                        <span className="swatch__value" style={{ backgroundImage: `url(${product.imageUrl})` }} />
                    </span>
                </div>
            )}
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    handleImageClick: PropTypes.func.isRequired
};

export default ProductCard;