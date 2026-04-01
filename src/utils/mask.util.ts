export const maskDate = (
  dateString: string, 
  format: "onlyDate" | "time" | "seconds" = "onlyDate"
) => {
  if (!dateString) return "";

  const arrayDate = dateString.split("T")[0].split("-");
  const date = new Date(dateString);

  const formattedDate = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`;

  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");

  switch (format) {
    case "time":
      return `${formattedDate} ${h}:${m}`;
    case "seconds":
      return `${formattedDate} ${h}:${m}:${s}`;
    case "onlyDate":
      return formattedDate;
    default:
      return formattedDate;
  }
};
export const maskPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
  let value = event.target.value.replace(/\D/g, '');

  value = value.slice(0, 11);

  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } 

  else {
    value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }

  event.target.value = value;
}

export const maskCPF = (event: React.ChangeEvent<HTMLInputElement>) => {
  let value = event.target.value.replace(/\D/g, ""); 

  value = value.slice(0, 11)

  value = value.replace(/^(\d{3})(\d)/, "$1.$2");
  value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");

  value = value.replace(/(\d{3})(\d{2})$/, "$1-$2");

  event.target.value = value;
};

export const maskCNPJ = (event: React.ChangeEvent<HTMLInputElement>) => {
  let value = event.target.value.replace(/\D/g, ""); 
  
  value = value.slice(0, 14);

  value = value.replace(/^(\d{2})(\d)/, "$1.$2"); 
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2"); 
  value = value.replace(/(\d{4})(\d{2})$/, "$1-$2"); 

  event.target.value = value;
};

export const maskZipCode = (event: React.ChangeEvent<HTMLInputElement>) => {
  let value = event.target.value.replace(/\D/g, "");

  value = value.slice(0, 8);

  value = value.replace(/^(\d{5})(\d)/, "$1-$2");

  event.target.value = value;
};

export const maskMoney = (event: React.ChangeEvent<HTMLInputElement>) => {
  let value = event.target.value.replace(/\D/g, "");

  value = value.slice(0, 15);

  if (!value) {
    event.target.value = "";
    return;
  }

  const cents = (parseInt(value, 10) / 100).toFixed(2);

  const formatted = cents
    .replace(".", ",")                
    .replace(/\B(?=(\d{3})+(?!\d))/g, "."); 

  event.target.value = formatted;
};

export const maskAgency = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  let value = event.target.value.replace(/\D/g, '');

  value = value.slice(0, 5);

  if (value.length > 4) {
    value = value.replace(/^(\d{4})(\d)$/, '$1-$2');
  }

  event.target.value = value;
};

export const maskAccount = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  let value = event.target.value.replace(/\D/g, '');

  value = value.slice(0, 13);

  if (value.length > 5) {
    value = value.replace(/^(\d{5,12})(\d)$/, '$1-$2');
  }

  event.target.value = value;
};

export interface TimeRemaining {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export const calculateTimeLeft = (targetDate: string): TimeRemaining => {
  const difference = +new Date(targetDate) - +new Date();
  
  if (difference <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00", isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    isExpired: false
  };
};

// FORMATED //
export const formattedMoney = (value: any) => {
  const amount = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(amount)) {
    return "R$ 0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
};

export const formattedCPF = (value: string): string => {
  if (!value) return "";

  const onlyDigits = value.replace(/\D/g, "");

  return onlyDigits
    .replace(/(\d{3})(\d)/, "$1.$2")       
    .replace(/(\d{3})(\d)/, "$1.$2")       
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2") 
    .substring(0, 14);                     
};