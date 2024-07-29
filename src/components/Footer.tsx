import { Typography } from "@mui/material";

export default function Footer() {
    return (
        <footer style={{bottom: 0, position: "fixed", margin: "5px"}}>
            <Typography variant="overline" display="block" gutterBottom>&copy; 2024 Josh Ghiloni</Typography>
        </footer>
    );
}
