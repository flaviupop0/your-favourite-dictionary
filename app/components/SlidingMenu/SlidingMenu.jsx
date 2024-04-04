import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const SlidingMenu = ({ anchorEl, onClose, open, firstHref, firstText, secondHref, secondText }) => {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 72, left: 0 }}
            sx={{
                "& .MuiMenu-paper": {
                    backgroundColor: "rgb(31, 41, 55)",
                },
                "& .MuiMenuItem-root": {
                    color: "white",
                    fontWeight: "bold",
                },
                "& .MuiMenuItem-root:hover": {
                    backgroundColor: "rgb(75, 85, 99)",
                },
            }}
        >
            <MenuItem onClick={onClose} component="a" href={firstHref}>
                {firstText}
            </MenuItem>
            <MenuItem onClick={onClose} component="a" href={secondHref}>
                {secondText}
            </MenuItem>
            <MenuItem onClick={onClose} component="a" href="/create-dictionary">
                Create dictionary
            </MenuItem>
        </Menu>
    );
};

export default SlidingMenu;
