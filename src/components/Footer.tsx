import { Typography } from "@mui/material";

export default function Footer() {
    return (
        <footer style={{bottom: 0, position: "fixed", padding: "5px", backgroundColor: "black", width: "100%"}}>
            <Typography variant="overline" display="block" gutterBottom sx={{opacity: 1}}>&copy; 2024 Josh Ghiloni</Typography>
        </footer>
    );
}
