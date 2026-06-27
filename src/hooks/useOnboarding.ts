
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'gbtl:onboarding_completed'

type State = 'loading' | 'pending' | 'done'

export function useOnboarding() {
  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((v) => setState(v === '1' ? 'done' : 'pending'))
      .catch(() => setState('pending'))
  }, [])

  async function complete() {
    await AsyncStorage.setItem(STORAGE_KEY, '1')
    setState('done')
  }

  async function reset() {
    await AsyncStorage.removeItem(STORAGE_KEY)
    setState('pending')
  }

  return { state, complete, reset }
}
