import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Countries from './Countries';

jest.mock('axios');

describe('Countries Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: [] });
    });

    it('fetches data and renders the countries when form is submitted', async () => {
        axios.get.mockResolvedValue({
            data: [
                {
                    name: { common: 'Country1' },
                    region: 'Region1',
                    capital: ['Capital1'],
                    population: 1000,
                },
                {
                    name: { common: 'Country2' },
                    region: 'Region2',
                    capital: ['Capital2'],
                    population: 2000,
                },
            ],
        });

        render(<Countries />);

        const nameInput = screen.getByLabelText('Name:');
        const populationInput = screen.getByLabelText('Population:');
        const sortSelect = screen.getByLabelText('Sort Order:');
        const elementsCountInput = screen.getByLabelText('Elements Count:');
        const submitButton = screen.getByText('Submit');

        fireEvent.change(nameInput, { target: { value: 'Country1' } });
        fireEvent.change(populationInput, { target: { value: '1500' } });
        fireEvent.change(sortSelect, { target: { value: 'descend' } });
        fireEvent.change(elementsCountInput, { target: { value: '2' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                'https://restcountries.com/v3.1/name/Country1'
            );
        });

        const country1Name = screen.getByText('Country1');
        const country2Name = screen.getByText('Country2');

        expect(country1Name).toBeInTheDocument();
        expect(country2Name).toBeInTheDocument();
    });
});