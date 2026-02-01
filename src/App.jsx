import { useState, useEffect, useRef } from 'react'
import cobwebImage from './assets/cobwebWithoutBG.png'
import bgMusic from './assets/BGmusic.mp3'
import broomSweep from './assets/broomSweep.mp3'
import validWords from './validWords.json'
import Graveyard from './components/Graveyard'
import GameBoard from './components/GameBoard'
import Keyboard from './components/Keyboard'
import ResultModal from './components/ResultModal'
import Cleaner from './components/Cleaner'
import FlyingCoffin from './components/FlyingCoffin'
import InstructionsModal from './components/InstructionsModal'

function App() {
  // ... existing code ...

  const [history, setHistory] = useState([])
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '', ''])
  const [targetWord, setTargetWord] = useState('')
  const [gameState, setGameState] = useState('playing')
  const [message, setMessage] = useState('')
  const [keyStatus, setKeyStatus] = useState({})
  const [hearts, setHearts] = useState(10)
  // Action can be 'INVALID' or 'INCORRECT' (valid word but wrong)
  const [cleanerState, setCleanerState] = useState({ active: false, targetRow: 0, action: null })
  const [flyingState, setFlyingState] = useState({ active: false })
  const [showInstructions, setShowInstructions] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const MAX_ATTEMPTS = 6

  const initialized = useRef(false)
  const audioRef = useRef(null)

  useEffect(() => {
    // Initialize Audio
    audioRef.current = new Audio(bgMusic)
    audioRef.current.loop = true
    audioRef.current.volume = 0.3

    // Attempt play
    const playPromise = audioRef.current.play()
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay prevented:", error)
        setIsMuted(true) // Fallback to muted if blocked
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => console.log("Play failed:", e))
      }
    }
  }, [isMuted])

  useEffect(() => {
    if (flyingState.active && !isMuted) {
      // Letters start flying at 800ms, staggered by 300ms
      const delays = [800, 1100, 1400, 1700, 2000]
      const timeouts = []

      delays.forEach(delay => {
        const timeoutId = setTimeout(() => {
          const sweepAudio = new Audio(broomSweep)
          sweepAudio.volume = 0.7
          sweepAudio.play().catch(e => console.log("Sweep play failed:", e))
        }, delay)
        timeouts.push(timeoutId)
      })

      return () => {
        timeouts.forEach(id => clearTimeout(id))
      }
    }
  }, [flyingState.active, isMuted])

  const initializedRef = useRef(false)

  useEffect(() => {
    // Check local storage for instructions
    const seenInstructions = localStorage.getItem('murdall_instructions_seen')
    if (!seenInstructions) {
      setShowInstructions(true)
    }

    if (!initialized.current) {
      initialized.current = true
      fetchNewWord()
    }
  }, [])

  const fetchNewWord = async () => {
    setMessage('Summoning...')
    try {
      const response = await fetch(
        'https://random-word-api.herokuapp.com/word?length=5'
      )
      const data = await response.json()
      if (data && data[0]) {
        console.log('Target:', data[0].toUpperCase())
        setTargetWord(data[0].toUpperCase())
        setMessage('Survive the Letter Hunt...')
      } else {
        setTargetWord('GHOST')
        setMessage('Network failed. Defaulting...')
      }
    } catch (error) {
      console.error(error)
      setTargetWord('DEATH')
      setMessage('Offline mode...')
    }
  }

  const handleInput = (value) => {
    if (gameState !== 'playing') return

    if (value === 'ENTER') return checkGuess()
    if (value === '⌫') return handleBackspace()

    const index = currentGuess.findIndex((val) => val === '')
    if (index === -1) return

    const newGuess = [...currentGuess]
    newGuess[index] = value.toUpperCase()
    setCurrentGuess(newGuess)
  }

  const handleBackspace = () => {
    const index = currentGuess.findLastIndex((val) => val !== '')
    if (index !== -1) {
      const newGuess = [...currentGuess]
      newGuess[index] = ''
      setCurrentGuess(newGuess)
    }
  }

  useEffect(() => {
    const handlePhysicalKey = (e) => {
      if (gameState !== 'playing') return

      if (e.key === 'Enter') checkGuess()
      else if (e.key === 'Backspace') handleBackspace()
      else if (/^[a-zA-Z]$/.test(e.key)) handleInput(e.key.toUpperCase())
    }

    window.addEventListener('keydown', handlePhysicalKey)
    return () => window.removeEventListener('keydown', handlePhysicalKey)
  }, [currentGuess, gameState])

  const checkGuess = () => {
    const guessString = currentGuess.join('')

    if (guessString.length !== 5) {
      setMessage('Too Short...')
      setTimeout(() => setMessage(''), 1500)
      return
    }

    if (!validWords.includes(guessString.toLowerCase())) {
      setMessage('Word not found...')
      setCleanerState({ active: true, targetRow: history.length, action: 'INVALID' })
      return
    }

    if (guessString === targetWord) {
      handleWin(guessString)
    } else {
      // It's a valid word, but wrong. Both Ghost and Flying Letters!
      setCleanerState({ active: true, targetRow: history.length, action: 'INCORRECT' })
      setFlyingState({ active: true })
    }
  }

  const handleWin = (guessString) => {
    const newHistory = [...history, guessString]
    setHistory(newHistory)
    updateKeyStatus(guessString)
    setGameState('won')
    setMessage('🎉 YOU SURVIVED! 🎉')
  }

  const updateKeyStatus = (guessString) => {
    const newKeyStatus = { ...keyStatus }
    guessString.split('').forEach((char, index) => {
      let status = 'gray'
      if (char === targetWord[index]) status = 'green'
      else if (targetWord.includes(char)) status = 'yellow'

      const current = newKeyStatus[char]
      if (status === 'green') newKeyStatus[char] = 'green'
      else if (status === 'yellow' && current !== 'green')
        newKeyStatus[char] = 'yellow'
      else if (status === 'gray' && !current)
        newKeyStatus[char] = 'gray'
    })
    setKeyStatus(newKeyStatus)
  }

  const processIncorrectGuess = () => {
    const guessString = currentGuess.join('')
    let damage = 0
    guessString.split('').forEach((char) => {
      if (!targetWord.includes(char)) damage++
    })

    const newHearts = hearts - damage
    setHearts(newHearts)

    const newHistory = [...history, guessString]
    setHistory(newHistory)
    updateKeyStatus(guessString)

    if (newHearts <= 0) {
      setGameState('lost')
      setMessage(`The Darkness Took You. Word: ${targetWord}`)
    } else if (newHistory.length >= MAX_ATTEMPTS) {
      setGameState('lost')
      setMessage(`Fate Sealed. Word: ${targetWord}`)
    } else {
      setCurrentGuess(['', '', '', '', ''])
    }
  }

  const handleCleanComplete = () => {
    setMessage('')
    const action = cleanerState.action
    setCleanerState({ active: false, targetRow: 0, action: null })

    if (action === 'INVALID') {
      setCurrentGuess(['', '', '', '', ''])
    }
    // If INCORRECT, FlyingCoffin handles the state update
  }

  const handleFlyingComplete = () => {
    setFlyingState({ active: false })
    processIncorrectGuess()
  }

  const handleRedo = () => {
    setHistory([])
    setCurrentGuess(['', '', '', '', ''])
    setKeyStatus({})
    setHearts(10)
    setGameState('playing')
    setTargetWord('')
    fetchNewWord()
  }

  const handleCloseInstructions = () => {
    setShowInstructions(false)
    localStorage.setItem('murdall_instructions_seen', 'true')
  }

  return (
    <div className="min-h-[100svh] w-full bg-[#0d0208] relative font-creepster overflow-hidden flex flex-col selection:bg-red-900 selection:text-white touch-none">
      <div className="bg-noise fixed inset-0 pointer-events-none z-0" />

      {/* Cobweb Decoration */}
      <img
        src={cobwebImage}
        alt="Cobweb"
        className="absolute top-0 left-0 w-24 sm:w-32 lg:w-48 opacity-60 pointer-events-none z-0"
      />

      {/* Mute Button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-2 right-10 sm:top-4 sm:right-16 z-40 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-stone-600 bg-stone-900/80 text-stone-400 hover:text-white hover:border-red-500 hover:shadow-[0_0_10px_#b91c1c] flex items-center justify-center text-xs sm:text-base transition-all"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Info Button */}
      <button
        onClick={() => setShowInstructions(true)}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-40 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-stone-600 bg-stone-900/80 text-stone-400 hover:text-white hover:border-red-500 hover:shadow-[0_0_10px_#b91c1c] flex items-center justify-center font-serif italic font-bold text-xs sm:text-base transition-all"
        aria-label="Instructions"
      >
        i
      </button>

      {/* TITLE */}
      <div className="flex-none pt-2 z-0 w-full flex justify-center">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl text-blood font-nosifer tracking-widest drop-shadow-[0_0_20px_#f00] leading-none opacity-90 select-none text-center">
          MURDALL
        </h1>
      </div>

      {/* GAME BOARD */}
      <div className="flex-1 w-full flex flex-row items-center justify-center z-10 min-h-0 gap-2 md:gap-0 relative">
        <Graveyard history={history} targetWord={targetWord} pending={flyingState.active} />

        {/* Cleaner Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 max-w-2xl mx-auto w-full">
          <Cleaner
            active={cleanerState.active}
            targetRow={cleanerState.targetRow}
            onCleanComplete={handleCleanComplete}
          />
          <FlyingCoffin
            active={flyingState.active}
            currentGuess={currentGuess}
            onComplete={handleFlyingComplete}
          />
        </div>
        <GameBoard
          currentGuess={currentGuess}
          history={history}
          hearts={hearts}
          message={message}
          gameState={gameState}
          MAX_ATTEMPTS={MAX_ATTEMPTS}
          hideActiveRow={flyingState.active}
        />
      </div>

      {/* KEYBOARD */}
      <div className="flex-none pb-2 z-20 w-full flex justify-center">
        <Keyboard onInput={handleInput} keyStatus={keyStatus} />
      </div>



      {/* MODAL */}
      <ResultModal gameState={gameState} onRedo={handleRedo} targetWord={targetWord} />

      {/* INSTRUCTIONS */}
      <InstructionsModal isOpen={showInstructions} onClose={handleCloseInstructions} />
    </div>
  )
}

export default App
