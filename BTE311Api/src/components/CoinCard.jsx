import { useState, useEffect } from 'react'
import './CoinCard.css'

function CoinCard({ coin, previousPrice, formatPrice, formatMarketCap }) {
  const priceChange = coin.price_change_percentage_24h || 0
  const isPositive = priceChange >= 0
  const [priceFlash, setPriceFlash] = useState(null) // 'up', 'down', or null
  const open24h =
    typeof coin?.current_price === 'number' && typeof coin?.price_change_24h === 'number'
      ? coin.current_price - coin.price_change_24h
      : null

  const formatMaybePrice = (value) =>
    typeof value === 'number' ? `$${formatPrice(value)}` : '—'

  const formatMaybeCompact = (value) =>
    typeof value === 'number' ? formatMarketCap(value) : '—'

  useEffect(() => {
    const currentPrice = coin.current_price
    
    // previousPrice prop'u geçerliyse ve fiyat değiştiyse animasyon göster
    if (previousPrice !== null && previousPrice !== undefined) {
      // Fiyat değişikliğini kontrol et (herhangi bir fark yeterli)
      const priceDiff = currentPrice - previousPrice
      const hasChanged = Math.abs(priceDiff) > 0 // Herhangi bir fark yeterli
      
      // Eğer fiyat değiştiyse animasyon göster
      if (hasChanged) {
        // Animasyon tipini belirle
        const flashType = priceDiff > 0 ? 'up' : 'down'
        
        // Animasyonu başlat
        setPriceFlash(flashType)
        
        // 2 saniye sonra animasyonu kaldır
        const timer = setTimeout(() => {
          setPriceFlash(null)
        }, 2000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [coin.current_price, previousPrice, coin.id])

  return (
    <div className={`coin-card ${priceFlash ? `flash-${priceFlash}` : ''}`}>
      <div className="coin-header">
        <img 
          src={coin.image} 
          alt={coin.name}
          className="coin-image"
        />
        <div className="coin-title">
          <h3>{coin.name}</h3>
          <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
        </div>
      </div>

      <div className="coin-price">
        <span className="price-label">Fiyat</span>
        <span className="price-value">${formatPrice(coin.current_price)}</span>
      </div>

      <div className="ohlc-grid">
        <div className="ohlc-item">
          <span className="ohlc-label">Açılış</span>
          <span className="ohlc-value">{formatMaybePrice(open24h)}</span>
        </div>
        <div className="ohlc-item">
          <span className="ohlc-label">Yüksek</span>
          <span className="ohlc-value">{formatMaybePrice(coin?.high_24h)}</span>
        </div>
        <div className="ohlc-item">
          <span className="ohlc-label">Düşük</span>
          <span className="ohlc-value">{formatMaybePrice(coin?.low_24h)}</span>
        </div>
        <div className="ohlc-item">
          <span className="ohlc-label">Hacim</span>
          <span className="ohlc-value">{formatMaybeCompact(coin?.total_volume)}</span>
        </div>
      </div>

      <div className="coin-stats">
        <div className="stat-item">
          <span className="stat-label">24s Değişim</span>
          <span className={`stat-value ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Piyasa Değeri</span>
          <span className="stat-value">{formatMarketCap(coin.market_cap)}</span>
        </div>
      </div>
    </div>
  )
}

export default CoinCard

