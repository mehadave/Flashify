// pages/ChooseLocation.tsx
import { useMemo, useState } from "react"
import { Box, Button, Container, List, ListItemButton, ListItemText, TextField, Typography } from "@mui/material"
import MyLocationIcon from "@mui/icons-material/MyLocation"
import { selectLocation } from "../services/api"
import { useNavigate } from "react-router-dom"

type Suggestion = { label: string; lat?: number; lng?: number }

const MOCK_SUGGESTIONS: Suggestion[] = [
  { label: "San Jose, CA", lat: 37.3382, lng: -121.8863 },
  { label: "Sunnyvale, CA", lat: 37.3688, lng: -122.0363 },
  { label: "Santa Clara, CA", lat: 37.3541, lng: -121.9552 },
  { label: "Mountain View, CA", lat: 37.3861, lng: -122.0839 },
]

export default function ChooseLocation() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MOCK_SUGGESTIONS
    return MOCK_SUGGESTIONS.filter(s => s.label.toLowerCase().includes(q))
  }, [query])

  const onPick = async (s: Suggestion) => {
    setLoading(true)
    try {
      await selectLocation(s)
      navigate("/addresses")
    } finally {
      setLoading(false)
    }
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported")

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          // label is a placeholder. Later: reverse geocode to actual area name.
          await selectLocation({ label: `Current location (${lat.toFixed(3)}, ${lng.toFixed(3)})`, lat, lng })
          navigate("/addresses")
        } catch (e: any) {
          alert(e?.response?.data?.message ?? "Failed to save location")
        } finally {
          setLoading(false)
        }
      },
      () => {
        setLoading(false)
        alert("Could not fetch location permission/coordinates")
      }
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700}>Choose your delivery location</Typography>
      <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
        This helps us show products available near you.
      </Typography>

      <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          label="Search area / city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="outlined"
          onClick={useCurrentLocation}
          disabled={loading}
          startIcon={<MyLocationIcon />}
        >
          Detect
        </Button>
      </Box>

      <List sx={{ mt: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        {filtered.map((s) => (
          <ListItemButton key={s.label} onClick={() => onPick(s)} disabled={loading}>
            <ListItemText primary={s.label} secondary={s.lat && s.lng ? `${s.lat.toFixed(3)}, ${s.lng.toFixed(3)}` : ""} />
          </ListItemButton>
        ))}
      </List>
    </Container>
  )
}
