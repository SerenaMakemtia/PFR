const formatDate = (date, format = 'dd/MM/yyyy') => {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) return '';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return format
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', year)
      .replace('HH', hours)
      .replace('mm', minutes);
  };
  
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) return '';
    
    return d.toISOString().split('T')[0];
  };
  
  const formatTimeForInput = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) return '';
    
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  const subtractDays = (date, days) => {
    return addDays(date, -days);
  };
  
  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };
  
  const getWeekRange = (date) => {
    const current = new Date(date);
    const day = current.getDay(); // 0 is Sunday, 6 is Saturday
    
    const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    const monday = new Date(current.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { start: monday, end: sunday };
  };
  
  const getMonthRange = (date) => {
    const current = new Date(date);
    
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);
    
    const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    
    return { start: firstDay, end: lastDay };
  };
  
  const getAgeFromDate = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };
  
  export {
    formatDate,
    formatDateForInput,
    formatTimeForInput,
    addDays,
    subtractDays,
    isSameDay,
    getWeekRange,
    getMonthRange,
    getAgeFromDate,
  };