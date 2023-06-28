export const Paths = {
    common: [
        {
            name: "О проекте",
            path: "/about.html"
        }
    ],
    client: [
        {
            name: "Мои заявки",
            path: "/client/requests.html"
        },
        {
            name: "О проекте",
            path: "/about.html"
        },
        {
            name: "Обратная связь",
            path: "/help.html"
        }
    ],
    volonter: [
        {
            name: "Задачи",
            path: "/volonter/task.html"
        },
        {
            name: "О проекте",
            path: "/about.html"
        },
        {
            name: "Обратная связь",
            path: "/help.html"
        }
    ],
    manager_organization: [
        {
            name: "Заявки",
            path: "/manager/requests.html"
        },
        {
            name: "О проекте",
            path: "/about.html"
        },
        {
            name: "Обратная связь",
            path: "/help.html"
        }
    ],
    admin: [
        {
            name: "Пользователи",
            path: "/admin/users.html"
        },
        {
            name: "О проекте",
            path: "/about.html"
        },
        {
            name: "Обратная связь",
            path: "/help.html"
        }
    ]
}

export const emptyRequest = {
    id: -1,
    name: "",
    description: "",
    addressDelivery: {
        city: "",
        street: "",
        house: "",
        apartment: ""
    },
    contact: "",
    status: "",
    volonter: "",
    owner: "",
}
export const statuses = [
    {
        value: "new",
        name: "Новый"
    }, {
        value: "approved",
        name: "Одобрено"
    }, {
        value: "work",
        name: "В работе"
    }, {
        value: "completed",
        name: "Выполнено"
    }
]

export const names = {
    id: "№",
    name: "Название",
    description: "Описание",
    addressDelivery: "Адрес доставки",
    contact: "Контакты",
    status: "Статус",
    volonter: "Волонтер",
    actions: "Действия",
    fio:"ФИО",
    dateBirth:"Дата рождения",
    city:"Город",
    phone:"Телефон",
    email:"Эл. почта",
    password:"Пароль",
    role:"Роль"

}
export const roles = [
    {
        value:"client",
        name:"Клиент"
    },
    {
        value:"volonter",
        name:"Волонтер"
    },
    {
        value:"manager_organization",
        name:"Сотрудник ресурсного центра"
    },
    {
        value:"admin",
        name:"Администратор"
    }
]