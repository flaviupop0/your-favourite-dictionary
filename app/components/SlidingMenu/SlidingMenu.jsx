import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CreateDictionaryModal from "../CreateDictionaryModal/CreateDictionaryModal";

const SlidingMenu = ({ userId, anchorEl, onClose, open, firstHref, firstText, secondHref, secondText, onDictionaryCreated }) => {
    const [isCreateDictionaryModalOpen, setCreateDictionaryModalOpen] = useState(false);

    const handleCreateDictionaryClick = () => {
        onClose();
        setCreateDictionaryModalOpen(true);
    };

    return (
        <>
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
                {secondHref && secondText && (
                    <MenuItem onClick={onClose} component="a" href={secondHref}>
                        {secondText}
                    </MenuItem>
                )}
                <MenuItem onClick={handleCreateDictionaryClick}>Create dictionary</MenuItem>
            </Menu>
            {isCreateDictionaryModalOpen && <CreateDictionaryModal onDictionaryCreated={onDictionaryCreated} userId={userId} onClose={() => setCreateDictionaryModalOpen(false)} />}
        </>
    );
};

export default SlidingMenu;
