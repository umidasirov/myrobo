import { useState, useMemo, useEffect } from "react";
import {
    Crown,
    Zap,
    Tv,
    Film,
    Sparkles,
    Wallet,
    CreditCard,
    X,
    Check,
    ChevronRight,
    Plus,
    Shield,
    Calendar,
    User,
    Lock,
    ArrowRight,
    Gift,
    TrendingUp,
    Sun,
    Moon,
    Terminal,
    Dock,
    BookOpen,
    GraduationCap,
    Laptop2,
    Rocket,
    Trophy,
} from "lucide-react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useData } from "../../datacontect";
import { div } from "framer-motion/client";
import { BsRobot } from "react-icons/bs";
import { FcDocument } from "react-icons/fc";
import { PiStudent } from "react-icons/pi";
const PERIODS = [
    { months: 1, label: "1 oy", discount: 0, badge: null },
    { months: 3, label: "3 oy", discount: 0.05, badge: true },
    { months: 6, label: "6 oy", discount: 0.1, badge: null },
    { months: 9, label: "9 oy", discount: 0.15, badge: true },
    { months: 12, label: "12 oy", discount: 0.2, badge: true },
];

const MAIN_PLANS = [
    {
        id: "plan-1",
        name: "1 oylik",
        period: "1 oy",
        months: 1,
        icon: BookOpen,
        monthlyPrice: 99000,
        discount: 0,
        badge: null,
        accent: "from-slate-400 to-slate-600",
        features: {
            compiler: "Kompilyator",
            simulator: "Simulyator",
            docs: "Dokumentatsiya",
            courses: "+1000 kurslar",
        },
        includes: ["Frontend", "Backend", "DevOps", "AI", "Robotics"],
        highlight: false,
    },
    {
        id: "plan-3",
        name: "3 oylik",
        period: "3 oy",
        months: 3,
        icon: GraduationCap,
        monthlyPrice: 99000,
        discount: 0.05,
        badge: null,
        accent: "from-cyan-400 to-blue-500",
        features: {
            compiler: "Kompilyator",
            simulator: "Simulyator",
            docs: "Dokumentatsiya",
            courses: "+1000 kurslar",
        },
        includes: ["Frontend", "Backend", "DevOps", "AI", "Robotics"],
        highlight: false,
    },
    {
        id: "plan-6",
        name: "6 oylik",
        period: "6 oy",
        months: 6,
        icon: Laptop2,
        monthlyPrice: 99000,
        discount: 0.1,
        badge: "Mashhur",
        accent: "from-amber-400 to-orange-500",
        features: {
            compiler: "Kompilyator",
            simulator: "Simulyator",
            docs: "Dokumentatsiya",
            courses: "+1000 kurslar",
        },
        includes: ["Frontend", "Backend", "DevOps", "AI", "Robotics"],
        highlight: true,
    },
    {
        id: "plan-9",
        name: "9 oylik",
        period: "9 oy",
        months: 9,
        icon: Rocket,
        monthlyPrice: 99000,
        discount: 0.15,
        badge: null,
        accent: "from-purple-400 to-pink-500",
        features: {
            compiler: "Kompilyator",
            simulator: "Simulyator",
            docs: "Dokumentatsiya",
            courses: "+1000 kurslar",
        },
        includes: ["Frontend", "Backend", "DevOps", "AI", "Robotics"],
        highlight: false,
    },
    {
        id: "plan-12",
        name: "12 oylik",
        period: "12 oy",
        months: 12,
        icon: Trophy,
        monthlyPrice: 99000,
        discount: 0.2,
        badge: "Foydali",
        accent: "from-emerald-400 to-teal-600",
        features: {
            compiler: "Kompilyator",
            simulator: "Simulyator",
            docs: "Dokumentatsiya",
            courses: "+1000 kurslar",
        },
        includes: ["Frontend", "Backend", "DevOps", "AI", "Robotics"],
        highlight: false,
    },
];

const ADDITIONAL_PLANS = [
    {
        id: "online-tv-lite",
        name: "ONLINE TV Lite",
        monthlyPrice: 19000,
        description:
            "NTV, Bolalar olami, Net Geo Wild, Zo'r TV, Yoshlar, BIZ TV va boshqa ko'plab turli mavzudagi telekanallarga kirish imkoniyatiga ega bo'ling.",
    },
    {
        id: "start",
        name: "START",
        monthlyPrice: 16000,
        description:
            "Butun oila uchun eksklyuziv seriallar va filmlar, START platformasi uchun maxsus ishlab chiqilgan original loyihalar.",
    },
    {
        id: "uzvideo",
        name: "UZVIDEO",
        monthlyPrice: 10000,
        description:
            "Mahalliy ishlab chiqarilgan barcha filmlar va seriallarni, shuningdek mahalliy telekanallardan boshqa qiziqarli relizlarni tomosha qiling.",
    },
    {
        id: "online-tv-full",
        name: "ONLINE TV Full",
        monthlyPrice: 29000,
        description: "Maksimal sifatdagi 180+ dan ortiq telekanallar.",
    },
    {
        id: "setanta",
        name: "SETANTA SPORTS",
        monthlyPrice: 16999,
        description:
            "«Setanta Sports 1» va «Setanta Sports 2» telekanallarida dunyoning eng yirik va xilma-xil sport musobaqalarini tomosha qiling.",
    },
    {
        id: "wink",
        name: "Wink",
        monthlyPrice: 16000,
        description:
            "Wink xizmatining original seriallarini tomosha qiling, shuningdek STS kanalining mashhur film va seriallariga kirish imkoniyatiga ega bo'ling.",
    },
];

const TOP_UP_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

const formatPrice = (price) =>
    new Intl.NumberFormat("ru-RU").format(Math.round(price));

const calculatePrice = (monthlyPrice, months, discount) => {
    const total = monthlyPrice * months;
    return total * (1 - discount);
};
export default function PaymentPage() {
    const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[0]);
    const [modalState, setModalState] = useState({ open: false, type: null, plan: null });
    const [darkMode, setDarkMode] = useState(false);
    const { user, fetchUserData, loading } = useData();
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);
    const balance = user?.balance ?? 0;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    useEffect(() => {
        fetchUserData()
    }, []);

    useEffect(() => {
        if (!token) {
            notification.error({
                message: "Ro'yhatdan o'ting!",
            });
            navigate("/login");
        }
    }, [token, navigate]);

    const openSubscribeModal = (plan) => {
        setModalState({ open: true, type: "subscribe", plan });
    };

    const openTopUpModal = () => {
        setModalState({ open: true, type: "topup", plan: null });
    };

    const closeModal = () => {
        setModalState({ open: false, type: null, plan: null });
    };

    const handlePaymentSuccess = (amount, isTopUp) => {
        if (isTopUp) {
            setBalance((prev) => prev + amount);
        } else {
            setBalance((prev) => Math.max(0, prev - amount));
        }
        closeModal();
    };

    if (loading) {
        return
        <div>
            loading...
        </div>
    }
    else {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 text-slate-900 dark:text-white transition-colors">
                {/* HEADER */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* HERO */}
                    <section className="mb-10 sm:mb-12 flex justify-between items-start" >
                        <div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                                Obunalar va tariflar
                            </h2>
                            <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl">
                                O'zingizga mos tarifni tanlang va o'rganishni hozirdan boshlang! Har bir reja sizga to'liq kirish huquqini beradi va doimiy yangilanishlarni o'z ichiga oladi.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700">
                                <Wallet className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                                <span className="text-sm text-slate-500 dark:text-gray-400">
                                    Hisob:
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {formatPrice(balance)} so'm
                                </span>
                            </div>
                            <button
                                onClick={openTopUpModal}
                                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">To'ldirish</span>
                                <span className="sm:hidden">{formatPrice(balance)}</span>
                            </button>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h3 className="text-sm font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                            Tariflar
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {MAIN_PLANS.map((plan) => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    onSubscribe={() => openSubscribeModal(plan)}
                                />
                            ))}
                        </div>
                    </section>

                </main>

                {modalState.open && (
                    <PaymentModal
                        state={modalState}
                        period={selectedPeriod}
                        balance={balance}
                        onClose={closeModal}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
            </div>
        );
    }
}

// ============================================
// PLAN CARD (main)
// ============================================
function PlanCard({ plan, onSubscribe }) {
    const Icon = plan.icon;
    const totalPrice = calculatePrice(plan.monthlyPrice, plan.months, plan.discount);
    const originalPrice = plan.monthlyPrice * plan.months;
    const hasDiscount = plan.discount > 0;

    return (
        <div
            className={`group relative bg-white dark:bg-gray-800 border rounded-2xl p-5 sm:p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${plan.highlight
                    ? "border-blue-300 dark:border-blue-500/40 shadow-lg shadow-blue-500/10"
                    : "border-slate-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30"
                }`}
        >
            {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    {plan.badge}
                </div>
            )}

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-5">
                <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br bg-blue-500 flex items-center justify-center shadow-md`}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4 className="text-xl font-bold tracking-tight">{plan.name}</h4>
                    {hasDiscount && (
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            −{Math.round(plan.discount * 100)}% chegirma
                        </span>
                    )}
                </div>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <FeatureItem icon={Terminal} value={plan.features.compiler} label="Kod yozish" />
                <FeatureItem icon={BsRobot} value={plan.features.simulator} label="Amaliyot" />
                <FeatureItem
                    icon={FcDocument}
                    value={plan.features.docs}
                    label="Qo'llanmalar"
                />
                <FeatureItem
                    icon={PiStudent}
                    value={plan.features.courses}
                    label="Kontent"
                />
            </div>

            {/* INCLUDES */}
            <div className="flex flex-wrap gap-1.5 mb-5">
                {plan.includes.map((item) => (
                    <span
                        key={item}
                        className="text-[11px] font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300"
                    >
                        {item}
                    </span>
                ))}
            </div>

            {/* PRICE */}
            <div className="flex items-end justify-between gap-3 pt-5 border-t border-slate-100 dark:border-gray-700">
                <div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                        {plan.period}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            {formatPrice(totalPrice)}
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
                            so'm
                        </span>
                    </div>
                    {hasDiscount && (
                        <div className="text-xs text-slate-400 dark:text-gray-500 line-through mt-0.5">
                            {formatPrice(originalPrice)} so'm
                        </div>
                    )}
                </div>
                <button
                    onClick={onSubscribe}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-lg hover:shadow-blue-500/30"
                >
                    Sotib olish
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function FeatureItem({ icon: Icon, value, label }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-gray-700/50 border border-slate-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-slate-600 dark:text-gray-300" />
            </div>
            <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {value}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-gray-400 leading-tight truncate">
                    {label}
                </div>
            </div>
        </div>
    );
}

// ============================================
// ADDITIONAL PLAN CARD
// ============================================
function AdditionalPlanCard({ plan, period, onSubscribe }) {
    const totalPrice = calculatePrice(plan.monthlyPrice, period.months, period.discount);
    const originalPrice = plan.monthlyPrice * period.months;
    const hasDiscount = period.discount > 0;

    return (
        <div className="group bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-500/30 hover:-translate-y-0.5">
            <h4 className="text-lg font-bold mb-2">{plan.name}</h4>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-5 line-clamp-3">
                {plan.description}
            </p>

            <div className="flex items-end justify-between gap-3 pt-4 border-t border-slate-100 dark:border-gray-700">
                <div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                        {period.label}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold">{formatPrice(totalPrice)}</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-gray-400">
                            so'm
                        </span>
                    </div>
                    {hasDiscount && (
                        <div className="text-[11px] text-slate-400 dark:text-gray-500 line-through mt-0.5">
                            {formatPrice(originalPrice)} so'm
                        </div>
                    )}
                </div>
                <button
                    onClick={onSubscribe}
                    className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-500 active:bg-blue-600 text-white font-semibold text-sm transition-all"
                >
                    Faollashtirish
                </button>
            </div>
        </div>
    );
}

// ============================================
// PAYMENT MODAL
// ============================================
function PaymentModal({ state, period, balance, onClose, onSuccess }) {
    const isTopUp = state.type === "topup";
    const plan = state.plan;

    const subscriptionPrice = useMemo(() => {
        if (!plan) return 0;
        return calculatePrice(plan.monthlyPrice, period.months, period.discount);
    }, [plan, period]);

    const [step, setStep] = useState("method"); // method | card | success
    const [paymentMethod, setPaymentMethod] = useState(
        isTopUp ? "card" : "balance"
    );
    const [topUpAmount, setTopUpAmount] = useState(TOP_UP_AMOUNTS[1]);
    const [customAmount, setCustomAmount] = useState("");

    const [card, setCard] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: "",
    });

    const finalAmount = isTopUp
        ? customAmount
            ? parseInt(customAmount) || 0
            : topUpAmount
        : subscriptionPrice;

    const canUseBalance = !isTopUp && balance >= subscriptionPrice;

    const handleCardChange = (field, value) => {
        let formatted = value;
        if (field === "number") {
            formatted = value
                .replace(/\D/g, "")
                .slice(0, 16)
                .replace(/(.{4})/g, "$1 ")
                .trim();
        } else if (field === "expiry") {
            formatted = value.replace(/\D/g, "").slice(0, 4);
            if (formatted.length >= 3) {
                formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
            }
        } else if (field === "cvv") {
            formatted = value.replace(/\D/g, "").slice(0, 3);
        }
        setCard({ ...card, [field]: formatted });
    };

    const isCardValid =
        card.number.replace(/\s/g, "").length === 16 &&
        card.expiry.length === 5 &&
        card.cvv.length === 3 &&
        card.name.trim().length > 2;

    const handlePay = () => {
        if (!isTopUp && paymentMethod === "balance") {
            setStep("success");
            setTimeout(() => onSuccess(finalAmount, false), 1200);
            return;
        }
        if (paymentMethod === "card") {
            if (step === "method") {
                setStep("card");
                return;
            }
            if (isCardValid) {
                setStep("success");
                setTimeout(() => onSuccess(finalAmount, isTopUp), 1200);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
            onClick={onClose}
        >
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" />

            {/* MODAL */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full sm:max-w-md bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col animate-slideUp"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-gray-700">
                    <div className="min-w-0 flex-1 pr-3">
                        <h3 className="text-lg sm:text-xl font-bold truncate text-slate-900 dark:text-white">
                            {isTopUp
                                ? "Hisobni to'ldirish"
                                : step === "success"
                                    ? "Tayyor!"
                                    : `To'lov: ${plan?.name}`}
                        </h3>
                        {!isTopUp && step !== "success" && (
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                                {period.label}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 flex items-center justify-center transition shrink-0"
                    >
                        <X className="w-4 h-4 text-slate-700 dark:text-gray-300" />
                    </button>
                </div>

                {/* BODY */}
                <div className="overflow-y-auto flex-1 p-5 sm:p-6">
                    {step === "success" ? (
                        <SuccessView amount={finalAmount} isTopUp={isTopUp} plan={plan} />
                    ) : isTopUp ? (
                        <TopUpView
                            amounts={TOP_UP_AMOUNTS}
                            selected={topUpAmount}
                            setSelected={setTopUpAmount}
                            customAmount={customAmount}
                            setCustomAmount={setCustomAmount}
                            card={card}
                            onCardChange={handleCardChange}
                        />
                    ) : step === "method" ? (
                        <SubscribeMethodView
                            plan={plan}
                            period={period}
                            price={subscriptionPrice}
                            method={paymentMethod}
                            setMethod={setPaymentMethod}
                            balance={balance}
                            canUseBalance={canUseBalance}
                        />
                    ) : (
                        <CardForm card={card} onChange={handleCardChange} />
                    )}
                </div>

                {/* FOOTER */}
                {step !== "success" && (
                    <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-900/30">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-slate-600 dark:text-gray-400">
                                To'lov miqdori
                            </span>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                {formatPrice(finalAmount)} so'm
                            </span>
                        </div>
                        <button
                            onClick={handlePay}
                            disabled={
                                (isTopUp && finalAmount < 1000) ||
                                (paymentMethod === "card" &&
                                    step === "card" &&
                                    !isCardValid) ||
                                (!isTopUp && paymentMethod === "balance" && !canUseBalance)
                            }
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm hover:shadow-lg hover:shadow-blue-500/30"
                        >
                            {!isTopUp && paymentMethod === "balance"
                                ? "Hisobdan to'lash"
                                : step === "method" && paymentMethod === "card"
                                    ? "Davom etish"
                                    : "To'lash"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-gray-400 mt-3">
                            <Lock className="w-3 h-3" />
                            Xavfsiz to'lov · SSL shifrlash
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// MODAL VIEWS
// ============================================
function SubscribeMethodView({ plan, period, price, method, setMethod, balance, canUseBalance }) {
    return (
        <div className="space-y-4">
            {/* SUMMARY */}
            <div className="rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-1">
                            Tarif
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                            {plan.name}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                            {period.label}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                            Narx
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatPrice(price)} so'm
                        </div>
                    </div>
                </div>
                {period.discount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400 font-medium pt-2 border-t border-blue-200 dark:border-blue-500/20">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {Math.round(period.discount * 100)}% chegirma qo'llanildi
                    </div>
                )}
            </div>

            {/* PAYMENT METHODS */}
            <div>
                <div className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
                    To'lov usuli
                </div>
                <div className="space-y-2">
                    <button
                        onClick={() => canUseBalance && setMethod("balance")}
                        disabled={!canUseBalance}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${method === "balance"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                                : "border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600"
                            } ${!canUseBalance ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === "balance"
                                    ? "bg-blue-500"
                                    : "bg-slate-100 dark:bg-gray-700"
                                }`}
                        >
                            <Wallet
                                className={`w-5 h-5 ${method === "balance"
                                        ? "text-white"
                                        : "text-slate-600 dark:text-gray-300"
                                    }`}
                            />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-semibold text-sm text-slate-900 dark:text-white">
                                Hisobdan
                            </div>
                            <div className="text-xs text-slate-500 dark:text-gray-400">
                                Mavjud: {formatPrice(balance)} so'm
                                {!canUseBalance && " · yetarli emas"}
                            </div>
                        </div>
                        {method === "balance" && (
                            <Check className="w-5 h-5 text-blue-500" />
                        )}
                    </button>

                    <button
                        onClick={() => setMethod("card")}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${method === "card"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                                : "border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600"
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${method === "card"
                                    ? "bg-blue-500"
                                    : "bg-slate-100 dark:bg-gray-700"
                                }`}
                        >
                            <CreditCard
                                className={`w-5 h-5 ${method === "card"
                                        ? "text-white"
                                        : "text-slate-600 dark:text-gray-300"
                                    }`}
                            />
                        </div>
                        <div className="flex-1 text-left">
                            <div className="font-semibold text-sm text-slate-900 dark:text-white">
                                Bank kartasi
                            </div>
                            <div className="text-xs text-slate-500 dark:text-gray-400">
                                Visa, Mastercard, UzCard, Humo
                            </div>
                        </div>
                        {method === "card" && <Check className="w-5 h-5 text-blue-500" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

function TopUpView({
    amounts,
    selected,
    setSelected,
    customAmount,
    setCustomAmount,
    card,
    onCardChange,
}) {
    return (
        <div className="space-y-5">
            <div>
                <div className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
                    To'ldirish miqdori
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {amounts.map((amount) => (
                        <button
                            key={amount}
                            onClick={() => {
                                setSelected(amount);
                                setCustomAmount("");
                            }}
                            className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${selected === amount && !customAmount
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                    : "border-slate-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500/30 text-slate-700 dark:text-gray-300"
                                }`}
                        >
                            {formatPrice(amount)}
                        </button>
                    ))}
                </div>
                <div className="mt-3">
                    <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1.5">
                        Yoki o'z miqdoringizni kiriting
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={customAmount}
                            onChange={(e) =>
                                setCustomAmount(e.target.value.replace(/\D/g, "").slice(0, 8))
                            }
                            placeholder="0"
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white focus:border-blue-500 focus:bg-blue-50/30 dark:focus:bg-blue-500/5 outline-none transition-all font-semibold pr-14"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400 dark:text-gray-500">
                            so'm
                        </span>
                    </div>
                </div>
            </div>

            <CardForm card={card} onChange={onCardChange} />
        </div>
    );
}

function CardForm({ card, onChange }) {
    return (
        <div className="space-y-4">
            <div className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-1">
                Karta ma'lumotlari
            </div>

            <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1.5">
                    Karta raqami
                </label>
                <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
                    <input
                        type="text"
                        inputMode="numeric"
                        value={card.number}
                        onChange={(e) => onChange("number", e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500 focus:bg-blue-50/30 dark:focus:bg-blue-500/5 outline-none transition-all tracking-wider"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1.5">
                        Amal qilish muddati
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={card.expiry}
                        onChange={(e) => onChange("expiry", e.target.value)}
                        placeholder="OO/YY"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500 focus:bg-blue-50/30 dark:focus:bg-blue-500/5 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1.5">
                        CVV
                    </label>
                    <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
                        <input
                            type="password"
                            inputMode="numeric"
                            value={card.cvv}
                            onChange={(e) => onChange("cvv", e.target.value)}
                            placeholder="•••"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500 focus:bg-blue-50/30 dark:focus:bg-blue-500/5 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs text-slate-500 dark:text-gray-400 mb-1.5">
                    Karta egasining ismi
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
                    <input
                        type="text"
                        value={card.name}
                        onChange={(e) =>
                            onChange("name", e.target.value.toUpperCase().slice(0, 30))
                        }
                        placeholder="ALI VALIYEV"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 focus:border-blue-500 focus:bg-blue-50/30 dark:focus:bg-blue-500/5 outline-none transition-all uppercase"
                    />
                </div>
            </div>
        </div>
    );
}

function SuccessView({ amount, isTopUp, plan }) {
    return (
        <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                {isTopUp ? "Hisob to'ldirildi" : "Obuna faollashtirildi"}
            </h3>
            <p className="text-slate-600 dark:text-gray-400 text-sm mb-4">
                {isTopUp
                    ? `Hisobingizga ${formatPrice(amount)} so'm o'tkazildi`
                    : `${plan?.name} tarifi muvaffaqiyatli faollashtirildi`}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                <Check className="w-4 h-4" />
                Tayyor
            </div>
        </div>
    );
}