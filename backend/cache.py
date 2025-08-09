from typing import Any, Optional
import time

class InMemoryCache:
    def __init__(self):
        self._cache = {}
    
    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            value, expiry = self._cache[key]
            if expiry is None or expiry > time.time():
                return value
            del self._cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        expiry = time.time() + ttl if ttl is not None else None
        self._cache[key] = (value, expiry)
    
    def delete(self, key: str) -> None:
        if key in self._cache:
            del self._cache[key]

# Create a singleton instance
cache = InMemoryCache()
