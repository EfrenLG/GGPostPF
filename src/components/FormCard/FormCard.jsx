// React
import React from 'react';

// Estilos
import './FormCard.css';

// Funciones
import { progressBar } from '../../functions/progessBar';

const FormCard = ({ title, onSubmit, register, errors, fields, buttons, password, setPassword }) => {

    progressBar(length);

    return (

        <div className="container">

            <h2>{title}</h2>

            <form onSubmit={onSubmit}>

                {fields.map(({ name, label, type = "text", placeholder }) => (
                    <div key={name} className="form-group">
                        <label htmlFor={name}>{label}</label>
                        <input
                            {...register(name)}
                            type={type}
                            id={name}
                            name={name}
                            placeholder={placeholder}
                            required
                            onChange={(e) => {
                                if (name === 'password') {
                                    setPassword(e.target.value);
                                };
                            }}
                        />
                        {type === 'password' && name === 'password' && (
                            <div id="progress-container">
                                <div id="progress-bar" style={progressBar(password.length)}></div>
                            </div>
                        )}

                        <p className="text-danger small">{errors[name]?.message}</p>
                    </div>
                ))}

                <div className="form-actions">
                    <button type="submit">Enviar</button>
                    {buttons}
                </div>
            </form>
        </div>
    );
};

export default FormCard;