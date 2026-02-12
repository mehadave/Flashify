// pages/ManageAddresses.tsx
import { useEffect, useState } from "react"
import {
  Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, List, ListItem, ListItemText, MenuItem, Stack, TextField, Typography
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import { createAddress, deleteAddress, getAddresses, setDefaultAddress, type AddressPayload } from "../services/api"

type Address = AddressPayload & { id: number; is_default: boolean }

export default function ManageAddresses() {
  const [items, setItems] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState<AddressPayload>({
    label: "Home",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    is_default: true,
  })

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await getAddresses()
      setItems(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  const onSave = async () => {
    setLoading(true)
    try {
      await createAddress(form)
      setOpen(false)
      setForm({ label: "Home", line1: "", line2: "", city: "", state: "", zip: "", is_default: false })
      await refresh()
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Failed to create address")
    } finally {
      setLoading(false)
    }
  }

  const onMakeDefault = async (id: number) => {
    setLoading(true)
    try {
      await setDefaultAddress(id)
      await refresh()
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: number) => {
    if (!confirm("Delete this address?")) return
    setLoading(true)
    try {
      await deleteAddress(id)
      await refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700}>Your addresses</Typography>
          <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8 }}>
            Add at least one address to checkout faster.
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)} disabled={loading}>
          Add
        </Button>
      </Stack>

      <List sx={{ mt: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        {items.length === 0 && (
          <Box sx={{ p: 2 }}>
            <Typography>No addresses yet.</Typography>
          </Box>
        )}

        {items.map((a, idx) => (
          <Box key={a.id}>
            <ListItem
              secondaryAction={
                <Stack direction="row" spacing={1} alignItems="center">
                  {!a.is_default && (
                    <Button size="small" onClick={() => onMakeDefault(a.id)} disabled={loading}>
                      Set default
                    </Button>
                  )}
                  <IconButton onClick={() => onDelete(a.id)} disabled={loading}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={700}>{a.label}</Typography>
                    {a.is_default && <Chip label="Default" size="small" />}
                  </Stack>
                }
                secondary={`${a.line1}${a.line2 ? ", " + a.line2 : ""}, ${a.city}, ${a.state} ${a.zip}`}
              />
            </ListItem>
            {idx !== items.length - 1 && <Divider />}
          </Box>
        ))}
      </List>

      {/* Add Address Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add new address</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Label"
              value={form.label}
              onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))}
            >
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField label="Address line 1" value={form.line1} onChange={(e) => setForm(f => ({ ...f, line1: e.target.value }))} />
            <TextField label="Address line 2 (optional)" value={form.line2} onChange={(e) => setForm(f => ({ ...f, line2: e.target.value }))} />
            <Stack direction="row" spacing={2}>
              <TextField fullWidth label="City" value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} />
              <TextField fullWidth label="State" value={form.state} onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))} />
            </Stack>
            <TextField label="ZIP" value={form.zip} onChange={(e) => setForm(f => ({ ...f, zip: e.target.value }))} />

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={form.is_default ? "Will be default" : "Not default"}
                variant={form.is_default ? "filled" : "outlined"}
                onClick={() => setForm(f => ({ ...f, is_default: !f.is_default }))}
              />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Tap chip to toggle default
              </Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={onSave} variant="contained" disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
