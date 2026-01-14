import { useState, useEffect, useCallback, useRef } from 'react'
import CoinList from './components/CoinList'
import './App.css'

function App() {
  const [coins, setCoins] = useState([])
  const [previousCoins, setPreviousCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [countdown, setCountdown] = useState(60) // Geri sayım (saniye)
  const coinsRef = useRef([]) // Mevcut coins'i takip et

  const fetchCoins = useCallback(async () => {
    try {
      setLoading(true)
      const apiKey = import.meta.env.VITE_COINGECKO_API_KEY
      const url =
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'

      const headers = {}
      if (apiKey) {
        headers['x-cg-demo-api-key'] = apiKey
      }

      const response = await fetch(url, { headers })

      if (!response.ok) {
        throw new Error('API isteği başarısız oldu')
      }

      const data = await response.json()

      // Önceki fiyatları sakla (yenileme animasyonu için)
      // Mevcut coinleri previousCoins'e kaydet (useEffect ile otomatik güncellenecek)
      const currentCoins = coinsRef.current.length > 0 ? [...coinsRef.current] : []

      // Yeni veriyi set et ve ref'i güncelle
      // useEffect ile previousCoins otomatik güncellenecek
      coinsRef.current = currentCoins.length > 0 ? currentCoins : data
      setCoins(data)

      setLastUpdate(new Date())
      setCountdown(60) // Geri sayımı sıfırla
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Coin verisi alınamadı:', err)
    } finally {
      // Loading'i kesinlikle kapat
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCoins() // İlk yükleme

    // Geri sayım için interval (her saniye)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchCoins() // Geri sayım bittiğinde yenile
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [fetchCoins])

  const currentYear = new Date().getFullYear()

  return (
    <>
      <div className="app">
        <header className="app-header">
          <h1>🚀 CoinGecko Fiyat Takibi</h1>
          <p>Canlı Kripto Para Fiyatları</p>
        </header>

        {loading && coins.length === 0 ? (
          <div className="loading">Yükleniyor...</div>
        ) : error ? (
          <div className="error">Hata: {error}</div>
        ) : (
          <CoinList
            coins={coins}
            previousCoins={previousCoins}
            onRefresh={fetchCoins}
            loading={loading}
            lastUpdate={lastUpdate}
            countdown={countdown}
          />
        )}
      </div>

      <footer className="footer-bar">
        <div className="footer-inner">
          <div className="footer-text">
            {currentYear} · Emincan Doğan · BTE311 Final Ödevi
          </div>
        </div>
      </footer>
    </>
  )
}

export default App

