import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl,
    InputLabel, Button, Box, Typography
} from "@mui/material";
import { addHabit } from "../../../services/Habits/habitServices";

export default function AddHabitModal({ open, userId, onClose, onHabitAdded }) {

    const [name,        setName]        = useState("");
    const [description, setDescription] = useState("");
    const [frequency,   setFrequency]   = useState("daily");
    const [saving,      setSaving]      = useState(false);
    const [error,       setError]       = useState("");

    const handleSave = async () => {

        if (!name.trim()) {
            setError("Habit name is required");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const res = await addHabit({
                user_id:     userId,
                name:        name.trim(),
                description: description.trim(),
                frequency
            });

            if (res.success) {
                setName("");
                setDescription("");
                setFrequency("daily");
                onHabitAdded();
            } else {
                setError("Something went wrong, try again");
            }
        } catch(e) {
            setError("Failed to connect to server");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx:{ borderRadius:3 } }}
        >
            <DialogTitle sx={{ fontWeight:700, color:"#1b5e20" }}>
                Add New Habit
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display:"flex", flexDirection:"column", gap:2.5, pt:1 }}>

                    <TextField
                        label="Habit name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        fullWidth
                        size="small"
                        autoFocus
                    />

                    <TextField
                        label="Description (optional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                    />

                    <FormControl size="small" fullWidth>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                            label="Frequency"
                            value={frequency}
                            onChange={e => setFrequency(e.target.value)}
                        >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                        </Select>
                    </FormControl>

                    {error && (
                        <Typography sx={{ color:"#e53935", fontSize:13 }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px:3, pb:2.5 }}>
                <Button
                    onClick={onClose}
                    sx={{ textTransform:"none", color:"#888" }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    variant="contained"
                    sx={{
                        borderRadius:"999px",
                        backgroundColor:"#2e7d32",
                        textTransform:"none",
                        fontWeight:600,
                        "&:hover":{ backgroundColor:"#1b5e20" }
                    }}
                >
                    {saving ? "Saving..." : "Save Habit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}