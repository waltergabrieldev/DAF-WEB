function calcularIR2026(base){
    if (base <= 2428.8) return 0

    if (base <= 2826.65)
        return base * 0.075 - 182.16

    if (base <= 3751.05)
        return base * 0.15 - 394.16

    if (base <= 4664.68)
        return base * 0.255 - 675.49

    return base * 0.275 - 908.73
}

function aplicarRedutor(renda, ir){
    if (renda <= 5000){
        return Math.max(0, ir - 312.89)
    }

    if (renda <= 73500) {
        const reducao = 978.62 - (0.133145 * renda)
        return Math.max(0, ir - reducao)
    }

    return ir
}

export function calcularAdvogadoPF({renda}) {
    const baseCalculo = renda - 607.2;

    let ir = calcularIR2026(base);
    ir = aplicarRedutor(renda, ir);

    return {
        inss: 0,
        ir,
        total: ir,
        liquido: renda - ir
    }
}

export function calcularAdvogadoPJ({renda}){
    const DAS = renda * 0.045;

    const proLabore = Math.max(1621, renda * 0.1);

    const inss = prolabore * 0.11;
    const inssPatronal = prolabore * 0.2;

    const total = DAS + inss + inssPatronal;

    return {
        DAS,
        inss,
        inssPatronal,
        total,
        liquido: renda - total
    }
}