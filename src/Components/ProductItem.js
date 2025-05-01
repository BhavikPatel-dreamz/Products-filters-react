import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const ProductItem = ({ product }) => {

    const handleImageClick = (product) => {
        window.location.href = `${product.productUrl}`;
    };

  return (
    <div className="sidebar-box-content-col col-lg-3 col-md-3 col-6 pr_animated done mt__30 pr_loop_11 pr_grid_item product nt_pr desgin__1">
      <div className="product-inner pr">
        <div className="product-image pr oh lazyloadt4sed">
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
              src={product.imageUrl || null}
              alt={product.name}
              className="main-img"
              effect="blur"
              style={{ height: "403px" }}
            />
            <img
              src={product.images?.[1]?.url || product.imageUrl || null}
              alt={product.name}
              className="hover-img"
              style={{ height: "403px" }}
            />
          </div>
          <div className="nt_add_w ts__03 pa">
            <a href={"#"} className="wishlistadd cb chp ttip_nt tooltip_right">
              <span className="tt_txt">Add to Wishlist</span>
              <i className="fa-regular fa-heart" />
            </a>
          </div>
          <div className="hover_button op__0 tc pa flex column ts__03 des_btns_pr_1 has_sizelistt4_true">
            <a href={product.productUrl.replace("//trendiaglobalstore.myshopify.com", "//trendia.co")} data-id={product.productId} className="pr pr_atc cd br__40 bgw tc dib js__qs cb chp ttip_nt tooltip_top_left" rel="nofollow">
              <span className="tt_txt">Quick Shop</span>
              <i className="fa-solid fa-cart-shopping" />
              <span>Quick Shop</span>
            </a>
          </div>
          <div className="product-attr pa ts__03 cw op__0 tc pe_none">
            <p className="truncate mg__0 w__100">{product.sizes}</p>
          </div>
        </div>

        <div className="product-info mt__15">
          <div className="product-brand">
            <a className="cg chp" href={"#"}>{product.brand}</a>
          </div>
          <h3 className="product-title pr fs__14 mg__0 fwm">
            <a className="cd chp" href={"#"}>{product.name}</a>
          </h3>
          <div className="yotpo-widget-instance" data-yotpo-product-id={product.id} />
          <span className="price dib mb__5">
            <del>Rs.{product.compareAtPrice}</del>
            <ins>Rs.{window.getPrice(product.price)}</ins>
          </span>
          <div className="shopify-product-reviews-badge star-rating" data-id={product.id} />
        </div>

        <div className="swatch__list_js swatch__list lh__1 nt_swatches_on_grid lazyloadt4sed">
          <span className="nt_swatch_on_bg swatch__list--item pr ttip_nt tooltip_top_right">
            <span className="tt_txt">{product.attributes?.color}</span>
            <span className="swatch__value" style={{ backgroundImage: `url(${product.imageUrl})` }} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;