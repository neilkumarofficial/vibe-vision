import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COUNTRY_CODES = [
    { code: '+1', country: 'United States', flag: 'mdi:flag-usa' },
    { code: '+44', country: 'United Kingdom', flag: 'mdi:flag-uk' },
    { code: '+91', country: 'India', flag: 'mdi:flag-india' },
    { code: '+86', country: 'China', flag: 'mdi:flag-china' },
    { code: '+81', country: 'Japan', flag: 'mdi:flag-japan' }
];

interface PhoneInputProps {
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
    placeholder?: string;
    className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
    value = '',
    onChange,
    name,
    placeholder = 'Phone Number',
    className
}) => {
    const [countryCode, setCountryCode] = useState('+1');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/\D/g, '');
        setPhoneNumber(inputValue);
        
        if (onChange) {
            onChange(`${countryCode}${inputValue}`);
        }
    };

    const handleCountryCodeChange = (code: string) => {
        setCountryCode(code);
        
        if (onChange) {
            onChange(`${code}${phoneNumber}`);
        }
    };

    return (
        <div className="flex space-x-2">
            <Select 
                value={countryCode} 
                onValueChange={handleCountryCodeChange}
            >
                <SelectTrigger className="w-24 bg-gray-800 border-none">
                    <SelectValue>
                        <div className="flex items-center">
                            <Icon 
                                icon={COUNTRY_CODES.find(c => c.code === countryCode)?.flag || 'mdi:flag-usa'} 
                                className="mr-2 h-5 w-5" 
                            />
                            {countryCode}
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {COUNTRY_CODES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center">
                                <Icon icon={country.flag} className="mr-2 h-5 w-5" />
                                {country.code} {country.country}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                type="tel"
                name={name}
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={placeholder}
                className={`flex-1 bg-gray-800 border-none text-white ${className}`}
                prefix={<Icon icon="mdi:phone" />}
            />
        </div>
    );
};
