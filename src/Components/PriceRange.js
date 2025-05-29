import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  setRange,
  setDisplayRange,
  selectPriceRange,
  selectDisplayRange,
} from '../Redux/Slices/PriceRange';
import parse from 'html-react-parser';

const PriceRangeSlider = (price) => {

  function get_currency(price) {
    const rate = window.Shopify?.currency?.rate || 1;
    const formatMoney = window.BOLD?.common?.Shopify?.formatMoney;

    if (typeof formatMoney !== 'function') {
      console.warn('formatMoney function is not available.');
      return ((price * 100) * rate);
    }

    return formatMoney((price * 100) * rate);
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const priceRange = useSelector(selectPriceRange);
  const displayRange = useSelector(selectDisplayRange);

  const [isDragging, setIsDragging] = useState(null);
  const [minValue, setMinValue] = useState(price.price.min);
  const [maxValue, setMaxValue] = useState(price.price.max);
  const [shouldResetToDefault, setShouldResetToDefault] = useState(false);

  const sliderRef = useRef(null);
  const rangeConfig = { min: price?.price?.min, max: price?.price?.max };

  const minPercent = ((minValue - rangeConfig.min) / (rangeConfig.max - rangeConfig.min)) * 100;
  const maxPercent = ((maxValue - rangeConfig.min) / (rangeConfig.max - rangeConfig.min)) * 100;

  // Function to get URL parameters
  const getUrlParams = () => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    
    return {
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null
    };
  };

  // Function to check if any non-price filter is selected
  const hasNonPriceFilters = () => {
    const params = new URLSearchParams(location.search);
    const allParams = Array.from(params.keys());
    const nonPriceParams = allParams.filter(param => 
      param !== 'minPrice' && param !== 'maxPrice' && param !== 'collections'
    );
    return nonPriceParams.length > 0;
  };

  // Function to update URL and trigger navigation
  const updateUrlAndNavigate = (newMinValue, newMaxValue) => {
    const searchParams = new URLSearchParams(location.search);
    
    // Only set price params if they differ from the default range
    if (newMinValue !== price.price.min || newMaxValue !== price.price.max) {
      searchParams.set('minPrice', newMinValue);
      searchParams.set('maxPrice', newMaxValue);
    } else {
      // Remove price params if they match the default range
      searchParams.delete('minPrice');
      searchParams.delete('maxPrice');
    }

    // Use navigate to trigger URL change and component re-renders
    const newSearch = searchParams.toString();
    if (newSearch !== location.search.replace('?', '')) {
      navigate(`?${newSearch}`, { replace: true });
    }
  };

  useEffect(() => {
    if (price?.price?.min !== undefined && price?.price?.max !== undefined) {
      const urlParams = getUrlParams();
      
      // Check if we should reset to default (when other filters are applied)
      if (hasNonPriceFilters() && !urlParams.minPrice && !urlParams.maxPrice) {
        setShouldResetToDefault(true);
      } else {
        setShouldResetToDefault(false);
      }
      
      // Use URL params if available, otherwise use default price range
      const initialMin = urlParams.minPrice !== null ? urlParams.minPrice : price.price.min;
      const initialMax = urlParams.maxPrice !== null ? urlParams.maxPrice : price.price.max;
      
      // Set display range and store range
      dispatch(setDisplayRange({ min: initialMin, max: initialMax }));
      dispatch(setRange({ min: initialMin, max: initialMax }));
      
      // Update local state
      setMinValue(initialMin);
      setMaxValue(initialMax);
    }
  }, [price?.price?.min, price?.price?.max, location.search, dispatch]);

  useEffect(() => {
    if (displayRange.min !== null && displayRange.max !== null) {
      setMinValue(displayRange.min);
      setMaxValue(displayRange.max);
    }
  }, [displayRange]);

  const handleThumbDown = (thumb) => (e) => {
    e.preventDefault();
    setIsDragging(thumb);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let position = (clientX - rect.left) / rect.width;
      position = Math.min(Math.max(position, 0), 1);
      const value = Math.round(rangeConfig.min + position * (rangeConfig.max - rangeConfig.min));

      if (isDragging === 'min') {
        const newMin = Math.min(Math.max(value, rangeConfig.min), maxValue - 1);
        setMinValue(newMin);
      } else {
        const newMax = Math.max(Math.min(value, rangeConfig.max), minValue + 1);
        setMaxValue(newMax);
      }
    };

    const handleUp = () => {
      setIsDragging(null);
      dispatch(setDisplayRange({ min: minValue, max: maxValue }));
    
      // Update URL using React Router navigation instead of direct history manipulation
      updateUrlAndNavigate(minValue, maxValue);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchend', handleUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, minValue, maxValue, dispatch, location.search, navigate, price.price.min, price.price.max]);

  // Determine which values to display in the price label
  const displayMinValue = shouldResetToDefault ? price.price.min : minValue;
  const displayMaxValue = shouldResetToDefault ? price.price.max : maxValue;
  return (
    <div className="">
      <div className="t4s-price_slider_wrapper">
        <div className="t4s-price_slider" />

        <div className="t4s-price_slider_amount">
          <div className="t4s-price_steps_slider noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr" ref={sliderRef}>
            <div className="noUi-base">
              <div className="noUi-connects">
                <div
                  className="noUi-connect"
                  style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                  }}
                />
              </div>
              <div
                className="noUi-origin"
                style={{ left: `${minPercent}%` }}
                onMouseDown={handleThumbDown('min')}
                onTouchStart={handleThumbDown('min')}
                tabIndex={0}
                role="slider"
                aria-valuenow={minValue}
                aria-valuemin={rangeConfig.min}
                aria-valuemax={maxValue - 1}
              >
                <div className="noUi-handle noUi-handle-lower">
                  <div className="noUi-touch-area" />
                </div>
              </div>
              <div
                className="noUi-origin"
                style={{ left: `${maxPercent}%` }}
                onMouseDown={handleThumbDown('max')}
                onTouchStart={handleThumbDown('max')}
                tabIndex={0}
                role="slider"
                aria-valuenow={maxValue}
                aria-valuemin={minValue + 1}
                aria-valuemax={rangeConfig.max}
              >
                <div className="noUi-handle noUi-handle-upper">
                  <div className="noUi-touch-area" />
                </div>
              </div>
            </div>
          </div>

          <div className="t4s-price_label">
            <span className="t4s-from">
              <span className="money">{parse(`<span>${get_currency(displayMinValue)}</span>`)}</span>
            </span>
            {' '}—{' '}
            <span className="t4s-to">
              <span className="money">{parse(`<span>${get_currency(displayMaxValue)}</span>`)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;