import { useState } from 'react'
import CoinCard from './CoinCard'
import './CoinList.css'

function CoinList({ coins, previousCoins, onRefresh, loading, lastUpdate, countdown }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const formatUpdateTime = (date) => {
    if (!date) return ''
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  const getPreviousPrice = (coinId) => {
    const previousCoin = previousCoins.find(c => c.id === coinId)
    return previousCoin ? previousCoin.current_price : null
  }

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price) => {
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    return price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`
    return `$${cap.toLocaleString()}`
  }

  return (
    <div className="coin-list-container">
      <div className="controls">
        <input
          type="text"
          placeholder="Coin ara... (örn: Bitcoin, BTC)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="refresh-controls">
          <button 
            onClick={onRefresh} 
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? 'Yenileniyor...' : '🔄 Yenile'}
          </button>
          <div className="countdown-timer">
            <span className="countdown-label">Yenileme:</span>
            <span className="countdown-value">{countdown}s</span>
          </div>
        </div>
      </div>

      {lastUpdate && (
        <div className="update-info">
          <span className="update-text">
            ✓ Yeni veriler çekildi - Son güncelleme: {formatUpdateTime(lastUpdate)}
          </span>
        </div>
      )}
      
      <div className="coins-grid">
        {filteredCoins.map((coin) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            previousPrice={getPreviousPrice(coin.id)}
            formatPrice={formatPrice}
            formatMarketCap={formatMarketCap}
          />
        ))}
      </div>

      {filteredCoins.length === 0 && (
        <div className="no-results">
          Aradığınız kriterlere uygun coin bulunamadı.
        </div>
      )}
    </div>
  )
}

export default CoinList

