import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRange, setDisplayRange, selectPriceRange, selectDisplayRange } from '../Redux/Slices/PriceRange';

const PriceRangeSlider = (price) => {

  function get_currency(price) {
    const rate = window.Shopify?.currency?.rate || 1;
    const formatMoney = window.BOLD?.common?.Shopify?.formatMoney;
  
    if (typeof formatMoney !== 'function') {
      console.warn('formatMoney function is not available.');
      return ((price*100) * rate).toFixed(2);
    }
  
    return formatMoney(price * rate);
  }

  const dispatch = useDispatch();
  const priceRange = useSelector(selectPriceRange);
  const displayRange = useSelector(selectDisplayRange);
  console.log(displayRange,"displayRange")
  
  const [isDragging, setIsDragging] = useState(null);
  const [minValue, setMinValue] = useState(price.price.min);
  const [maxValue, setMaxValue] = useState(price.price.max);
  const sliderRef = useRef(null);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);
  const rangeConfig = { min: price?.price?.min, max: price?.price?.max};
  const minPercent = ((minValue - rangeConfig.min) / (rangeConfig.max - rangeConfig.min)) * 100;
  const maxPercent = ((maxValue - rangeConfig.min) / (rangeConfig.max - rangeConfig.min)) * 100;
  // Initialize Redux state with price range values on component mount

  useEffect(() => {
    if (price?.price?.min !== undefined && price?.price?.max !== undefined) {
      // Only initialize if Redux state is null (first time)
      if (displayRange.min === null || displayRange.max === null) {
        dispatch(setDisplayRange({ min: price.price.min, max: price.price.max }));
        dispatch(setRange({ min: price.price.min, max: price.price.max }));
      }
    }
  }, [price?.price?.min, price?.price?.max, dispatch, displayRange.min, displayRange.max]);



  useEffect(() => {
    // Only update local state if displayRange has valid values
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
        // dispatch(setDisplayRange({ min: newMin, max: displayRange.max }));
      } else {
        const newMax = Math.max(Math.min(value, rangeConfig.max), minValue + 1);
        setMaxValue(newMax);
        // dispatch(setDisplayRange({ min: displayRange.min, max: newMax }));
      }
    };
    const handleUp = () => {
      setIsDragging(null);
      dispatch(setDisplayRange({ min: minValue, max: maxValue}));
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
  }, [isDragging, minValue, maxValue, dispatch, displayRange]);

  return (
    <div className={'widget blockid_brand'}>
      <h5 className={'widget-title t4s-facet-title'}>By Price Range</h5>
      <div
        ref={sliderRef}
        className={'sliderTrack'}
      >
        <div
          className="selectedRange"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        />
        <div
          ref={minThumbRef}
          className='thumb'
          style={{
            left: `${minPercent}%`
          }}
          onMouseDown={handleThumbDown('min')}
          onTouchStart={handleThumbDown('min')}
          tabIndex={0}
          role="slider"
          aria-valuenow={minValue}
          aria-valuemin={rangeConfig.min}
          aria-valuemax={maxValue - 1}
        >
          <div className='tooltip'>
            {get_currency(minValue)}
          </div>
        </div>
        <div
          ref={maxThumbRef}
          className='thumb'
          style={{
            left: `${maxPercent}%`
          }}
          onMouseDown={handleThumbDown('max')}
          onTouchStart={handleThumbDown('max')}
          tabIndex={0}
          role="slider"
          aria-valuenow={maxValue}
          aria-valuemin={minValue + 1}
          aria-valuemax={rangeConfig.max}
        >
          <div className='tooltip'>
            {get_currency(maxValue)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;