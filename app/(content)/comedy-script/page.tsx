import { ComedyScriptGenerator } from '@/components/comedyscript/ComedyScriptGenerator';
import { Layout } from '@/components/layout/layout';
import { SparklesCore } from '@/components/ui/sparkles';

export default function comedyscript() {
    return (
        <Layout>
            <div className="absolute inset-0 z-0">
                <SparklesCore
                    id="forgot-password-sparkles"
                    background="purple"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    particleColor="#FFFFFF"
                />
            </div>
            <main className="min-h-screen p-6">
                <ComedyScriptGenerator />
            </main>
        </Layout>
    );
}