import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { createControlComponent } from '@react-leaflet/core';
import { Control } from 'leaflet';
import { Box, Container, Grid, List, ListItem, Typography, Button } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import * as L from "leaflet";

import './App.css';

import allBooks from './books.json';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Books = ({ books }) => (
    <List>
        {books.map((book, index) => (
            <ListItem key={index}>
                <Typography variant="body1">{book.title} {book.imprint} [{book.callno}]</Typography>
            </ListItem>
        ))}
    </List>
);

const useCreateHomeControl = (map) => {
    return useCallback(() => {
        const handleClick = () => {
            const defaultCenter = { lat: 37.58, lng: 58.20 };
            const defaultZoom = 3;
            map.setView(defaultCenter, defaultZoom);
        };

        const homeControl = Control.extend({
            onAdd: () => {
                const container = document.createElement('div');
                container.className = 'leaflet-bar leaflet-control leaflet-control-custom';
                const button = document.createElement('a');
                button.href = '#';
                button.title = 'Home';
                button.innerHTML = '&#x1F3E0;'; // Unicode home character
                button.onclick = (e) => {
                    e.preventDefault();
                    handleClick();
                };
                container.appendChild(button);
                return container;
            },
        });

        return new homeControl({ position: 'topleft' });
    }, [map]);
};





const BookMap = ({ books }) => {
    const map = useMap();
    const createHomeControl = useCreateHomeControl(map);
    const HomeControl = createControlComponent(createHomeControl);

    const handleMarkerClick = (lat, lng) => {
        map.flyTo([lat, lng], map.getZoom());
    };

    const handleLinkClick = (url, e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <HomeControl />
            {books.map((book, index) => (
                <Marker
                    key={index}
                    position={[book.lat, book.lng]}
                    eventHandlers={{
                        click: () => handleMarkerClick(book.lat, book.lng),
                    }}
                >
                    <Popup>
                        {book.title}
                        <br />
                        {book.callno}
                        <br />
                        <a
                            href={book.bobcat_url}
                            onClick={(e) => handleLinkClick(book.bobcat_url, e)}
                        >
                            View in Library Catalog
                        </a>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};



const App = () => {
    const [books, setBooks] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const defaultCenter = { lat: 37.58, lng: 58.20 };
    const defaultZoom = 3;

    useEffect(() => {
        const filteredBooks = allBooks.filter((book) => {
            const bookDate = new Date(book.date);
            return (
                bookDate.getFullYear() === currentDate.getFullYear() &&
                bookDate.getMonth() === currentDate.getMonth() - 1
            );
        });

        // Sort books alphabetically by title
        const sortedBooks = filteredBooks.sort((a, b) => a.callno.localeCompare(b.callno));

        setBooks(sortedBooks);
    }, [currentDate]);

    const handlePreviousMonth = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h2">ISAW Library New Titles Map beta</Typography>
                <Typography variant="h4">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Box sx={{ height: 400 }}>
                            <MapContainer
                                center={defaultCenter}
                                zoom={defaultZoom}
                                style={{ width: '90%', height: '400px', margin: 'auto' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <BookMap books={books} />
                            </MapContainer>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" onClick={handlePreviousMonth}>
                            Previous Month
                        </Button>
                        <Button variant="outlined" onClick={handleNextMonth}>
                            Next Month
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Books books={books} />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default App;
