export const Theme = {
    colors: {
        primary: '#6366F1', // Indigo 500
        primaryDark: '#4F46E5', // Indigo 600
        secondary: '#10B981', // Emerald 500
        accent: '#F59E0B', // Amber 500
        background: '#F8FAFC', // Slate 50
        surface: '#FFFFFF',
        text: {
            primary: '#1E293B', // Slate 800
            secondary: '#64748B', // Slate 500
            muted: '#94A3B8', // Slate 400
            inverse: '#FFFFFF',
        },
        border: '#E2E8F0', // Slate 200
        status: {
            onTime: '#10B981',
            delayed: '#F59E0B',
            early: '#3B82F6',
            breakdown: '#EF4444',
        }
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
        full: 9999,
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        }
    }
};
